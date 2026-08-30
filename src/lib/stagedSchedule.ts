import { addDaysUtc, daysBetweenUtc, formatDate, isWeekday, toIsoDate } from './dateUtils.ts';

export type HolidayTreatment = 'skip-flex' | 'count-flex';
export type PhaseId = 'phase1' | 'phase2';

export type PublicHoliday = { date: string; name: string };

export type ScheduleEvent = {
  date: Date;
  phase: PhaseId;
  kind: 'work' | 'flexible' | 'holiday-work' | 'holiday-flex-skipped' | 'holiday-flex-counted';
  holidayName?: string;
};

export type PhaseSummary = {
  id: PhaseId;
  startDate: Date | null;
  endDate: Date | null;
  workDaysPerWeek: number;
  flexibleDaysPerWeek: number;
  flexibleDaysUsed: number;
  holidayFlexDaysSkipped: number;
};

export type FlexibleSchedule = {
  phaseOneEndDate: Date | null;
  phaseTwoStartDate: Date | null;
  phaseSummaries: PhaseSummary[];
  events: ScheduleEvent[];
  flexibleDates: Date[];
  holidayEvents: ScheduleEvent[];
  flexibleDaysUsed: number;
  flexibleDaysRemaining: number;
  scheduleEndDate: Date | null;
  statutoryDeadlineReached: boolean;
  /**
   * True once the schedule's calendar cursor actually reaches phaseTwoStartDate
   * before running out of flexible days or hitting the statutory deadline.
   * Not derived from phase-2 flexible-day usage: a phase 2 work pattern of
   * 5 days/week uses zero flexible days but is still an active phase (this
   * is app-internal scheduling logic, not a statutory term — no external
   * source applies).
   */
  hasActivePhaseTwo: boolean;
  totalReducedWorkCalendarDays: number;
  totalReducedWorkWeeks: number;
};

export type BuildFlexibleLeaveScheduleInput = {
  returnDate: Date;
  availableFlexibleDays: number;
  phaseOneWeeks: number | 'until-exhausted';
  phaseOneWorkWeekdays: number[];
  phaseTwoWorkWeekdays: number[];
  holidays: PublicHoliday[];
  holidayTreatment: HolidayTreatment;
  statutoryDeadlineExclusive: Date;
};

const uniqueWeekdays = (days: number[]): number[] =>
  [...new Set(days.filter((day) => Number.isInteger(day) && day >= 1 && day <= 5))];

/**
 * Builds actual post-return calendar dates. Unlike the statutory notional
 * period, this intentionally applies the chosen public-holiday treatment.
 */
export const buildFlexibleLeaveSchedule = (
  input: BuildFlexibleLeaveScheduleInput,
): FlexibleSchedule => {
  const available = Math.max(0, Math.floor(input.availableFlexibleDays));
  const phaseOneWeeks = typeof input.phaseOneWeeks === 'number' && Number.isFinite(input.phaseOneWeeks)
    ? Math.max(0, Math.floor(input.phaseOneWeeks))
    : null;
  const phaseOneWorkdays = uniqueWeekdays(input.phaseOneWorkWeekdays);
  const phaseTwoWorkdays = uniqueWeekdays(input.phaseTwoWorkWeekdays);
  const phaseTwoStartDate = phaseOneWeeks === null
    ? null
    : addDaysUtc(input.returnDate, phaseOneWeeks * 7);
  const holidayByDate = new Map(input.holidays.map((holiday) => [holiday.date, holiday]));
  const events: ScheduleEvent[] = [];
  const flexibleDates: Date[] = [];
  const phaseUsage: Record<PhaseId, { used: number; skipped: number }> = {
    phase1: { used: 0, skipped: 0 },
    phase2: { used: 0, skipped: 0 },
  };
  let remaining = available;
  let lastFlexibleDate: Date | null = null;
  let phaseTwoReached = false;
  let cursor = new Date(input.returnDate.getTime());

  while (cursor.getTime() < input.statutoryDeadlineExclusive.getTime() && remaining > 0) {
    if (isWeekday(cursor)) {
      const phase: PhaseId = !phaseTwoStartDate || cursor.getTime() < phaseTwoStartDate.getTime()
        ? 'phase1'
        : 'phase2';
      if (phase === 'phase2') phaseTwoReached = true;
      const workdays = phase === 'phase1' ? phaseOneWorkdays : phaseTwoWorkdays;
      const holiday = holidayByDate.get(toIsoDate(cursor));

      if (workdays.includes(cursor.getUTCDay())) {
        events.push({
          date: new Date(cursor.getTime()),
          phase,
          kind: holiday ? 'holiday-work' : 'work',
          ...(holiday ? { holidayName: holiday.name } : {}),
        });
      } else if (holiday && input.holidayTreatment === 'skip-flex') {
        phaseUsage[phase].skipped += 1;
        events.push({
          date: new Date(cursor.getTime()),
          phase,
          kind: 'holiday-flex-skipped',
          holidayName: holiday.name,
        });
      } else {
        remaining -= 1;
        phaseUsage[phase].used += 1;
        lastFlexibleDate = new Date(cursor.getTime());
        flexibleDates.push(lastFlexibleDate);
        events.push({
          date: new Date(cursor.getTime()),
          phase,
          kind: holiday ? 'holiday-flex-counted' : 'flexible',
          ...(holiday ? { holidayName: holiday.name } : {}),
        });
      }
    }
    cursor = addDaysUtc(cursor, 1);
  }

  const phaseSummaries: PhaseSummary[] = [
    {
      id: 'phase1',
      startDate: input.returnDate,
      endDate: lastFlexibleDate && (phaseOneWeeks === null || !phaseTwoStartDate
        || lastFlexibleDate.getTime() < phaseTwoStartDate.getTime())
        ? lastFlexibleDate
        : phaseTwoStartDate && phaseOneWeeks !== null && phaseOneWeeks > 0
          ? addDaysUtc(phaseTwoStartDate, -1)
        : null,
      workDaysPerWeek: phaseOneWorkdays.length,
      flexibleDaysPerWeek: 5 - phaseOneWorkdays.length,
      flexibleDaysUsed: phaseUsage.phase1.used,
      holidayFlexDaysSkipped: phaseUsage.phase1.skipped,
    },
    {
      id: 'phase2',
      startDate: phaseTwoStartDate,
      endDate: phaseTwoStartDate && lastFlexibleDate && lastFlexibleDate.getTime() >= phaseTwoStartDate.getTime()
        ? lastFlexibleDate
        : null,
      workDaysPerWeek: phaseTwoWorkdays.length,
      flexibleDaysPerWeek: 5 - phaseTwoWorkdays.length,
      flexibleDaysUsed: phaseUsage.phase2.used,
      holidayFlexDaysSkipped: phaseUsage.phase2.skipped,
    },
  ];

  return {
    phaseOneEndDate: phaseSummaries[0].endDate,
    phaseTwoStartDate,
    phaseSummaries,
    events,
    flexibleDates,
    holidayEvents: events.filter((event) => event.kind.startsWith('holiday-')),
    flexibleDaysUsed: available - remaining,
    flexibleDaysRemaining: remaining,
    scheduleEndDate: lastFlexibleDate,
    statutoryDeadlineReached: remaining > 0 && cursor.getTime() >= input.statutoryDeadlineExclusive.getTime(),
    hasActivePhaseTwo: phaseTwoReached,
    totalReducedWorkCalendarDays: lastFlexibleDate
      ? daysBetweenUtc(input.returnDate, lastFlexibleDate) + 1
      : 0,
    totalReducedWorkWeeks: lastFlexibleDate
      ? (daysBetweenUtc(input.returnDate, lastFlexibleDate) + 1) / 7
      : 0,
  };
};

export type PhaseOneLimit = {
  maximumWholeWeeks: number;
  latestTransitionDate: Date | null;
  phaseOneExhaustionDate: Date | null;
};

/**
 * Finds the latest calendar point at which a 3-day phase can still be active.
 * It uses the actual schedule, including public-holiday treatment and the
 * child's statutory deadline; it is not a generic duration cap.
 */
export const getPhaseOneLimit = (
  input: Omit<BuildFlexibleLeaveScheduleInput, 'phaseOneWeeks'>,
): PhaseOneLimit => {
  const allPhaseOne = buildFlexibleLeaveSchedule({ ...input, phaseOneWeeks: 'until-exhausted' });
  const phaseOneExhaustionDate = allPhaseOne.scheduleEndDate;
  const latestTransitionDate = phaseOneExhaustionDate
    ? addDaysUtc(phaseOneExhaustionDate, 1)
    : null;
  const maximumWholeWeeks = latestTransitionDate
    ? Math.max(0, Math.floor(daysBetweenUtc(input.returnDate, latestTransitionDate) / 7))
    : 0;

  return { maximumWholeWeeks, latestTransitionDate, phaseOneExhaustionDate };
};

export const clampPhaseOneWeeks = (requestedWeeks: number, limit: PhaseOneLimit): number =>
  Math.max(0, Math.min(Math.floor(requestedWeeks) || 0, limit.maximumWholeWeeks));

export const describeScheduleEnd = (schedule: FlexibleSchedule): string =>
  schedule.scheduleEndDate ? formatDate(schedule.scheduleEndDate) : 'No flexible leave dates scheduled';
