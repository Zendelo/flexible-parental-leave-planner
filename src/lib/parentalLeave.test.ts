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
  assert.equal(getNotionalFlexibleCalendarDays(5), 7);
  assert.equal(getNotionalFlexibleCalendarDays(20), 28);
  assert.equal(getNotionalFlexibleCalendarDays(40), 56);
  assert.equal(getNotionalFlexibleCalendarDays(60), 84);
  assert.equal(getNotionalFlexibleCalendarDays(120), 168);
});

test('flexible-day caps change at each statutory cohort threshold', () => {
  assert.equal(getFlexibleDayCap(date('2024-06-30')), 100);
  assert.equal(getFlexibleDayCap(date('2024-07-01')), 110);
  assert.equal(getFlexibleDayCap(date('2025-12-20')), 120);
  assert.equal(getFlexibleDayCap(date('2026-07-01')), 130);
  assert.equal(getMaximumReserveForReturn(date('2025-12-01'), date('2026-10-01'), 120), 44);
});

test('december_2025_extension_timing_regression derives the preserved reserve', () => {
  assert.equal(
    getMaximumReserveForSection76Request(date('2025-12-01'), date('2026-08-12'), 120),
    59,
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
