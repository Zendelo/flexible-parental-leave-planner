import assert from 'node:assert/strict';
import test from 'node:test';
import { addMonthsUtc, parseIsoDate, toIsoDate } from './dateUtils.ts';
import {
  getFlexibleDayCap,
  getMaximumReserveForReturn,
  getMaximumReserveForSection76Request,
  getNotionalFlexibleCalendarDays,
} from './parentalLeave.ts';

const date = (value: string): Date => parseIsoDate(value)!;

test('notional flexible period always ignores public holidays', () => {
  // Anchor is a Friday: every remainder count of workdays walks back through
  // exactly one weekend at most, so the naive 5-in-7 ratio and the real
  // weekday walk agree here — full weeks only, no remainder.
  const friday = date('2027-08-06');
  assert.equal(getNotionalFlexibleCalendarDays(friday, 5), 7);
  assert.equal(getNotionalFlexibleCalendarDays(friday, 20), 28);
  assert.equal(getNotionalFlexibleCalendarDays(friday, 40), 56);
  assert.equal(getNotionalFlexibleCalendarDays(friday, 60), 84);
  assert.equal(getNotionalFlexibleCalendarDays(friday, 120), 168);
});

test('notional flexible period depends on which weekday the anchor date falls on', () => {
  // Regression for a bug where the calendar-day conversion used a fixed
  // 5-workdays-equals-7-calendar-days ratio regardless of anchor weekday,
  // verified by simulation on 2026-08-30 (see parentalLeave.ts comment).
  // 2027-08-03 is a Tuesday: 2 flexible days should walk back through the
  // weekend (Tue, Mon, <weekend>, Fri) even though 2 < 5.
  const tuesday = date('2027-08-03');
  assert.equal(getNotionalFlexibleCalendarDays(tuesday, 1), 1);
  assert.equal(getNotionalFlexibleCalendarDays(tuesday, 2), 4);
  assert.equal(getNotionalFlexibleCalendarDays(tuesday, 3), 5);
});

test('flexible-day caps change at each statutory cohort threshold', () => {
  assert.equal(getFlexibleDayCap(date('2020-06-30')), 0);
  assert.equal(getFlexibleDayCap(date('2020-07-01')), 30);
  assert.equal(getFlexibleDayCap(date('2023-06-30')), 30);
  assert.equal(getFlexibleDayCap(date('2023-07-01')), 100);
  assert.equal(getFlexibleDayCap(date('2024-06-30')), 100);
  assert.equal(getFlexibleDayCap(date('2024-07-01')), 110);
  assert.equal(getFlexibleDayCap(date('2025-12-20')), 120);
  assert.equal(getFlexibleDayCap(date('2026-07-01')), 130);
  assert.equal(getMaximumReserveForReturn(date('2025-12-01'), date('2026-10-01'), 120), 43);
});

test('december_2025_extension_timing_regression derives the preserved reserve', () => {
  assert.equal(
    getMaximumReserveForSection76Request(date('2025-12-01'), date('2026-08-12'), 120),
    58,
  );
});

test('UTC date-only handling crosses DST, year and month boundaries without shifting', () => {
  assert.equal(toIsoDate(date('2026-10-04')), '2026-10-04');
  assert.equal(toIsoDate(date('2026-12-31')), '2026-12-31');
  assert.equal(toIsoDate(date('2027-02-28')), '2027-02-28');
});

test('UTC month arithmetic handles end-of-month and leap-year boundaries', () => {
  assert.equal(toIsoDate(addMonthsUtc(date('2024-01-31'), 1)), '2024-02-29');
  assert.equal(toIsoDate(addMonthsUtc(date('2026-12-31'), 1)), '2027-01-31');
});
