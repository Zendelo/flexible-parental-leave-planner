/**
 * National Employment Standards rules used by the planner.
 * Verified 2026-08-30 against the Fair Work Act 2009 (ss 70, 72A, 74 and 76)
 * and Fair Work Ombudsman parental leave guidance. Per-field sourcing below;
 * `sources` lists the two primary references cited throughout.
 */
export const parentalLeaveRules = {
  rulesLastVerified: '2026-08-30',
  sources: [
    { name: 'Fair Work Act 2009 — Compilation No. 73', url: 'https://www.legislation.gov.au/C2009A00028/2026-07-07' },
    { name: 'Fair Work Ombudsman — parental leave', url: 'https://www.fairwork.gov.au/leave/parental-leave' },
  ],
  /**
   * Flexible unpaid parental leave day cap by the child's date of birth or
   * placement (Fair Work Act 2009 s 72A(2)). No entitlement existed before
   * 1 Jul 2020 (flexible unpaid parental leave was introduced by the Fair
   * Work Amendment (Improving Unpaid Parental Leave for Parents of
   * Stillborn Babies and Other Measures) Act 2020 (Cth) sch 2, commencing
   * 1 Jul 2020, cap 30 days). The cap tracks the Paid Parental Leave
   * scheme's week count as it expanded from 20 to 26 weeks: 100 days from
   * 1 Jul 2023, 110 from 1 Jul 2024, 120 from 1 Jul 2025, 130 from 1 Jul
   * 2026 (Fair Work Legislation Amendment (Protecting Worker Entitlements)
   * Act 2023 (Cth) and later regulations).
   * Checked 2026-08-30 against:
   * https://www.legislation.gov.au/C2009A00028/2026-07-07 and
   * https://www.fairwork.gov.au/leave/parental-leave/before-parental-leave/types-of-parental-leave
   */
  flexibleDayCaps: [
    { effectiveFrom: '2020-07-01', effectiveTo: '2023-06-30', flexibleDayCap: 30 },
    { effectiveFrom: '2023-07-01', effectiveTo: '2024-06-30', flexibleDayCap: 100 },
    { effectiveFrom: '2024-07-01', effectiveTo: '2025-06-30', flexibleDayCap: 110 },
    { effectiveFrom: '2025-07-01', effectiveTo: '2026-06-30', flexibleDayCap: 120 },
    { effectiveFrom: '2026-07-01', effectiveTo: null, flexibleDayCap: 130 },
  ],
  /** 24-month window to use flexible days, from the child's birth/placement date (Fair Work Act 2009 s 72A(1)(b)). Checked 2026-08-30. */
  maximumStatutoryWindowMonths: 24,
  /**
   * A written extension request must reach the employer at least 4 weeks
   * (28 days) before the end of the available parental leave period (Fair
   * Work Act 2009 s 76; Fair Work Ombudsman —
   * https://www.fairwork.gov.au/leave/parental-leave/during-parental-leave/extending-parental-leave
   * — checked 2026-08-30). Stored as 29, not 28: this is subtracted from
   * getInitialReturnDate (the first day back at work, one day *after* the
   * available period ends), so 28 days before the period's last day is
   * 29 days before the return date. This models timing only, not whether a
   * request is otherwise valid.
   */
  extensionRequestLeadDays: 29,
  /** Notice of intention to take parental leave, given as early as practical and at least this many weeks beforehand (Fair Work Act 2009 s 74(1)). Checked 2026-08-30. */
  initialNoticeWeeks: 10,
  /** Notice of specific flexible unpaid parental leave days, at least this many weeks beforehand where practical (Fair Work Act 2009 s 74(3C)). Checked 2026-08-30. */
  flexibleDayNoticeWeeks: 4,
  /** Not a legal source: an in-app UX threshold for surfacing the "check current rules" banner in App.tsx once `rulesLastVerified` is this many days old. */
  staleRuleThresholdDays: 180,
} as const;
