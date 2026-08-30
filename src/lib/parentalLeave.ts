import { addDaysUtc, addMonthsUtc, daysBetweenUtc, isWeekday, minDate } from './dateUtils.ts';
import { parentalLeaveRules } from '../config/parentalLeaveRules.ts';

/**
 * Source: Fair Work Act 2009 s 72A(2) (day cap by child's date of birth/
 * placement) — https://www.legislation.gov.au/C2009A00028/2026-07-07 —
 * checked 2026-08-30. Historical tiers (30-day cap from 1 Jul 2020, no
 * entitlement before commencement) cross-checked against the Fair Work
 * Amendment (Improving Unpaid Parental Leave for Parents of Stillborn
 * Babies and Other Measures) Act 2020 (Cth) sch 2 — checked 2026-08-30.
 */
export const getFlexibleDayCap = (childDate: Date): number => {
  const isoDate = childDate.toISOString().slice(0, 10);
  return parentalLeaveRules.flexibleDayCaps.find((rule) =>
    isoDate >= rule.effectiveFrom && (!rule.effectiveTo || isoDate <= rule.effectiveTo),
  )?.flexibleDayCap ?? 0;
};

/**
 * Walks backward from `date`, skipping Saturday/Sunday, until `count`
 * weekdays have been passed, and returns the date landed on (the count-th
 * weekday before `date`). Calendar-day span of a run of weekdays depends on
 * which weekday it starts/ends on — e.g. 3 weekdays ending the Tuesday
 * before a Wednesday anniversary run Tue-Mon-Fri, spanning 5 calendar days,
 * not 3 — so this walks real weekdays rather than using a fixed 5-in-7
 * ratio. Every day-of-week alignment was checked by simulation against this
 * walk on 2026-08-30 (see parentalLeave.test.ts).
 */
const subtractWeekdays = (date: Date, count: number): Date => {
  let cursor = date;
  let remaining = Math.max(0, Math.floor(count));
  while (remaining > 0) {
    cursor = addDaysUtc(cursor, -1);
    if (isWeekday(cursor)) remaining -= 1;
  }
  return cursor;
};

/**
 * Section 72A notional flexible period: the calendar-day length of the
 * employee's flexible days if taken as a single continuous period ending
 * the day before `anchorDate`, assuming ordinary Monday-Friday work and no
 * public holidays (Fair Work Act 2009 s 72A; Fair Work Ombudsman guidance —
 * https://www.fairwork.gov.au/leave/parental-leave — checked 2026-08-30).
 */
export const getNotionalFlexibleCalendarDays = (anchorDate: Date, flexibleDays: number): number =>
  daysBetweenUtc(subtractWeekdays(anchorDate, flexibleDays), anchorDate);

/** 12-month unpaid parental leave period (Fair Work Act 2009 s 71(1)) minus the notional flexible period above. */
export const getInitialReturnDate = (leaveStart: Date, flexibleDays: number): Date =>
  subtractWeekdays(addMonthsUtc(leaveStart, 12), flexibleDays);

/** Last day of continuous leave: the day before getInitialReturnDate. */
export const getAvailablePeriodEndDate = (leaveStart: Date, flexibleDays: number): Date =>
  addDaysUtc(getInitialReturnDate(leaveStart, flexibleDays), -1);

/** See parentalLeaveRules.extensionRequestLeadDays for the s 76 source and the +1 offset explanation. */
export const getSection76RequestDueDate = (leaveStart: Date, flexibleDays: number): Date =>
  addDaysUtc(getInitialReturnDate(leaveStart, flexibleDays), -parentalLeaveRules.extensionRequestLeadDays);

/** First day flexible leave is no longer available (Fair Work Act 2009 s 72A(1)(b)); see parentalLeaveRules.maximumStatutoryWindowMonths. */
export const getChildDeadlineExclusive = (childDate: Date): Date =>
  addMonthsUtc(childDate, parentalLeaveRules.maximumStatutoryWindowMonths);

/** Largest flexible-day reserve whose initial return date is on or before the chosen return date. */
export const getMaximumReserveForReturn = (
  leaveStart: Date,
  returnDate: Date,
  cap: number,
): number => {
  let maximum = 0;
  for (let candidate = 0; candidate <= cap; candidate += 1) {
    if (returnDate.getTime() <= getInitialReturnDate(leaveStart, candidate).getTime()) {
      maximum = candidate;
    }
  }
  return maximum;
};

/**
 * Largest reserve whose Section 76 request deadline is on or after the chosen
 * request date. This models timing only; it does not decide legal validity.
 */
export const getMaximumReserveForSection76Request = (
  leaveStart: Date,
  requestDate: Date,
  cap: number,
): number => {
  let maximum = 0;
  for (let candidate = 0; candidate <= cap; candidate += 1) {
    if (requestDate.getTime() <= getSection76RequestDueDate(leaveStart, candidate).getTime()) {
      maximum = candidate;
    }
  }
  return maximum;
};

/** Extended return date, capped at 12 months past the initial return date (Fair Work Act 2009 s 76) and at the s 72A(1)(b) 24-month deadline, whichever is earlier. */
export const getMaximumExtensionReturnDate = (
  leaveStart: Date,
  childDate: Date,
  flexibleDays: number,
): Date => minDate(
  addMonthsUtc(getInitialReturnDate(leaveStart, flexibleDays), 12),
  getChildDeadlineExclusive(childDate),
);
