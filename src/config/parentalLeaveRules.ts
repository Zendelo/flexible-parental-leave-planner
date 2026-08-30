/**
 * National Employment Standards rules used by the planner.
 * Verified 2026-08-30 against the Fair Work Act 2009 (ss 70, 72A, 74 and 76)
 * and Fair Work Ombudsman parental leave guidance.
 */
export const parentalLeaveRules = {
  rulesLastVerified: '2026-08-30',
  sources: [
    { name: 'Fair Work Act 2009 — Compilation No. 73', url: 'https://www.legislation.gov.au/C2009A00028/2026-07-07' },
    { name: 'Fair Work Ombudsman — parental leave', url: 'https://www.fairwork.gov.au/leave/parental-leave' },
  ],
  flexibleDayCaps: [
    { effectiveFrom: '0000-01-01', effectiveTo: '2024-06-30', flexibleDayCap: 100 },
    { effectiveFrom: '2024-07-01', effectiveTo: '2025-06-30', flexibleDayCap: 110 },
    { effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30', flexibleDayCap: 120 },
    { effectiveFrom: '2026-07-01', effectiveTo: null, flexibleDayCap: 130 },
  ],
  maximumStatutoryWindowMonths: 24,
  extensionRequestLeadDays: 29,
  initialNoticeWeeks: 10,
  flexibleDayNoticeWeeks: 4,
  staleRuleThresholdDays: 180,
} as const;
