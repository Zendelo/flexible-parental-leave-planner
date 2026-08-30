import assert from 'node:assert/strict';
import test from 'node:test';
import { parseIsoDate, toIsoDate } from './dateUtils.ts';
import { victoriaHolidayData, victoriaPublicHolidays } from '../data/victoriaPublicHolidays.ts';
import {
  buildFlexibleLeaveSchedule,
  clampPhaseOneWeeks,
  getPhaseOneLimit,
} from './stagedSchedule.ts';

const date = (value: string): Date => parseIsoDate(value)!;
const deadline = date('2027-12-20');
const standard = victoriaPublicHolidays.map(({ date: holidayDate, name }) => ({ date: holidayDate, name }));

test('december_2025_three_day_regression uses full weeks plus one flexible day without holidays', () => {
  const schedule = buildFlexibleLeaveSchedule({
    returnDate: date('2026-10-19'),
    availableFlexibleDays: 59,
    phaseOneWeeks: 99,
    phaseOneWorkWeekdays: [1, 3, 5],
    phaseTwoWorkWeekdays: [1, 2, 3, 5],
    holidays: [],
    holidayTreatment: 'skip-flex',
    statutoryDeadlineExclusive: deadline,
  });

  assert.equal(schedule.flexibleDaysUsed, 59);
  assert.equal(schedule.phaseSummaries[0].flexibleDaysUsed, 59);
  assert.equal(toIsoDate(schedule.scheduleEndDate!), '2027-05-11');
});

test('gentler return derives its end from the calendar and never creates phase two', () => {
  const input = {
    returnDate: date('2026-10-19'),
    availableFlexibleDays: 59,
    phaseOneWorkWeekdays: [1, 3, 5],
    phaseTwoWorkWeekdays: [1, 2, 3, 5],
    holidays: standard,
    holidayTreatment: 'skip-flex' as const,
    statutoryDeadlineExclusive: deadline,
  };
  const schedule = buildFlexibleLeaveSchedule({ ...input, phaseOneWeeks: 'until-exhausted' });
  const limit = getPhaseOneLimit(input);

  assert.equal(schedule.flexibleDaysUsed, 59);
  assert.equal(schedule.hasActivePhaseTwo, false);
  assert.equal(schedule.phaseSummaries[1].flexibleDaysUsed, 0);
  assert.equal(toIsoDate(schedule.scheduleEndDate!), '2027-05-18');
  assert.ok(schedule.scheduleEndDate!.getTime() < deadline.getTime());
  assert.equal(limit.maximumWholeWeeks, 30);
  assert.equal(toIsoDate(limit.latestTransitionDate!), '2027-05-19');
  assert.equal(clampPhaseOneWeeks(Number.MAX_SAFE_INTEGER, limit), 30);
});

test('12 weeks at three days then four days preserves the nominal 24 + 35 split', () => {
  const schedule = buildFlexibleLeaveSchedule({
    returnDate: date('2026-10-19'),
    availableFlexibleDays: 59,
    phaseOneWeeks: 12,
    phaseOneWorkWeekdays: [1, 3, 5],
    phaseTwoWorkWeekdays: [1, 2, 3, 5],
    holidays: [],
    holidayTreatment: 'skip-flex',
    statutoryDeadlineExclusive: deadline,
  });

  assert.equal(schedule.phaseSummaries[0].flexibleDaysUsed, 24);
  assert.equal(schedule.phaseSummaries[1].flexibleDaysUsed, 35);
  assert.equal(schedule.flexibleDaysRemaining, 0);
  assert.equal(schedule.hasActivePhaseTwo, true);
  assert.equal(toIsoDate(schedule.phaseTwoStartDate!), '2027-01-11');
});

test('longest duration starts phase two immediately', () => {
  const schedule = buildFlexibleLeaveSchedule({
    returnDate: date('2026-10-19'),
    availableFlexibleDays: 59,
    phaseOneWeeks: 0,
    phaseOneWorkWeekdays: [1, 3, 5],
    phaseTwoWorkWeekdays: [1, 2, 3, 5],
    holidays: standard,
    holidayTreatment: 'skip-flex',
    statutoryDeadlineExclusive: deadline,
  });

  assert.equal(schedule.phaseSummaries[0].flexibleDaysUsed, 0);
  assert.equal(schedule.hasActivePhaseTwo, true);
  assert.equal(toIsoDate(schedule.phaseTwoStartDate!), '2026-10-19');
});

test('december_2025_staged_return_regression applies Melbourne Cup only to the real-world calendar', () => {
  const schedule = buildFlexibleLeaveSchedule({
    returnDate: date('2026-10-19'),
    availableFlexibleDays: 59,
    phaseOneWeeks: 12,
    phaseOneWorkWeekdays: [1, 3, 5],
    phaseTwoWorkWeekdays: [1, 2, 3, 5],
    holidays: standard,
    holidayTreatment: 'skip-flex',
    statutoryDeadlineExclusive: deadline,
  });

  assert.equal(schedule.phaseSummaries[0].flexibleDaysUsed, 23);
  assert.equal(schedule.phaseSummaries[1].flexibleDaysUsed, 36);
  assert.equal(schedule.holidayEvents.filter((event) => event.kind === 'holiday-flex-skipped').length, 1);
  assert.equal(toIsoDate(schedule.scheduleEndDate!), '2027-09-16');
});

test('the 24-month deadline stops a longer four-day plan and reports unused days', () => {
  const schedule = buildFlexibleLeaveSchedule({
    returnDate: date('2026-12-01'),
    availableFlexibleDays: 120,
    phaseOneWeeks: 0,
    phaseOneWorkWeekdays: [1, 3, 5],
    phaseTwoWorkWeekdays: [1, 2, 3, 5],
    holidays: [],
    holidayTreatment: 'skip-flex',
    statutoryDeadlineExclusive: deadline,
  });

  assert.equal(schedule.statutoryDeadlineReached, true);
  assert.ok(schedule.flexibleDaysRemaining > 0);
  assert.equal(toIsoDate(schedule.scheduleEndDate!), '2027-12-16');
});

test('Melbourne Cup on a proposed Tuesday flex day can be skipped or counted', () => {
  const input = {
    returnDate: date('2026-11-02'),
    availableFlexibleDays: 1,
    phaseOneWeeks: 0,
    phaseOneWorkWeekdays: [1, 3, 4, 5],
    phaseTwoWorkWeekdays: [1, 3, 4, 5],
    holidays: standard,
    statutoryDeadlineExclusive: deadline,
  };
  const skipped = buildFlexibleLeaveSchedule({ ...input, holidayTreatment: 'skip-flex' });
  const counted = buildFlexibleLeaveSchedule({ ...input, holidayTreatment: 'count-flex' });

  assert.equal(toIsoDate(skipped.scheduleEndDate!), '2026-11-10');
  assert.equal(toIsoDate(counted.scheduleEndDate!), '2026-11-03');
  assert.equal(counted.holidayEvents[0].kind, 'holiday-flex-counted');
});

test('public holiday on a workday is marked but never consumes flexible leave', () => {
  const schedule = buildFlexibleLeaveSchedule({
    returnDate: date('2026-11-02'),
    availableFlexibleDays: 1,
    phaseOneWeeks: 0,
    phaseOneWorkWeekdays: [1, 2, 4, 5],
    phaseTwoWorkWeekdays: [1, 2, 4, 5],
    holidays: standard,
    holidayTreatment: 'skip-flex',
    statutoryDeadlineExclusive: deadline,
  });
  assert.equal(schedule.holidayEvents[0].kind, 'holiday-work');
  assert.equal(toIsoDate(schedule.scheduleEndDate!), '2026-11-04');
});

test('2027 AFL holiday is not guessed and the Boxing Day substitute is explicit', () => {
  assert.match(victoriaHolidayData.unconfirmed, /subject to AFL schedule/i);
  assert.equal(victoriaPublicHolidays.some((holiday) => holiday.date === '2027-09-24'), false);
  assert.equal(
    victoriaPublicHolidays.find((holiday) => holiday.date === '2026-12-28')?.name,
    'Additional Boxing Day public holiday',
  );
});
