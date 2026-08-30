import { addDaysUtc, addMonthsUtc, minDate } from './dateUtils.ts';
import { parentalLeaveRules } from '../config/parentalLeaveRules.ts';

/**
 * Fair Work Act 2009 ss 72A, 75 and 76; verified 2026-08-30 against the
 * Federal Register of Legislation and Fair Work Ombudsman guidance.
 */
export const getFlexibleDayCap = (childDate: Date): number => {
  const isoDate = childDate.toISOString().slice(0, 10);
  return parentalLeaveRules.flexibleDayCaps.find((rule) =>
    isoDate >= rule.effectiveFrom && (!rule.effectiveTo || isoDate <= rule.effectiveTo),
  )?.flexibleDayCap ?? 100;
};

/**
 * Section 72A notional flexible period. Public holidays are deliberately
 * ignored: the statute assumes ordinary Monday-Friday work and no holidays.
 */
export const getNotionalFlexibleCalendarDays = (flexibleDays: number): number => {
  const days = Math.max(0, Math.floor(flexibleDays));
  return Math.floor(days / 5) * 7 + (days % 5);
};

export const getInitialReturnDate = (leaveStart: Date, flexibleDays: number): Date =>
  addDaysUtc(
    addMonthsUtc(leaveStart, 12),
    -getNotionalFlexibleCalendarDays(flexibleDays),
  );

export const getAvailablePeriodEndDate = (leaveStart: Date, flexibleDays: number): Date =>
  addDaysUtc(getInitialReturnDate(leaveStart, flexibleDays), -1);

export const getSection76RequestDueDate = (leaveStart: Date, flexibleDays: number): Date =>
  addDaysUtc(getInitialReturnDate(leaveStart, flexibleDays), -parentalLeaveRules.extensionRequestLeadDays);

export const getChildDeadlineExclusive = (childDate: Date): Date =>
  addMonthsUtc(childDate, parentalLeaveRules.maximumStatutoryWindowMonths);

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

export const getMaximumExtensionReturnDate = (
  leaveStart: Date,
  childDate: Date,
  flexibleDays: number,
): Date => minDate(
  addMonthsUtc(getInitialReturnDate(leaveStart, flexibleDays), 12),
  getChildDeadlineExclusive(childDate),
);
