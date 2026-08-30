/**
 * Source: Business Victoria, Victorian public holidays 2026 and 2027.
 * Last verified: 2026-08-30. The 2027 AFL Grand Final holiday remains TBD
 * because Business Victoria says it is subject to the AFL schedule.
 */
export type VictoriaHoliday = {
  date: string;
  name: string;
  jurisdiction: 'VIC';
  scope: 'statewide';
  status: 'confirmed';
  sourceVerified: true;
  officialSource: 'Business Victoria';
  lastVerified: '2026-08-30';
};

const holiday = (date: string, name: string): VictoriaHoliday => ({
  date,
  name,
  jurisdiction: 'VIC',
  scope: 'statewide',
  status: 'confirmed',
  sourceVerified: true,
  officialSource: 'Business Victoria',
  lastVerified: '2026-08-30',
});

export const victoriaPublicHolidays: VictoriaHoliday[] = [
  holiday('2026-01-01', "New Year's Day"),
  holiday('2026-01-26', 'Australia Day'),
  holiday('2026-03-09', 'Labour Day'),
  holiday('2026-04-03', 'Good Friday'),
  holiday('2026-04-04', 'Saturday before Easter Sunday'),
  holiday('2026-04-05', 'Easter Sunday'),
  holiday('2026-04-06', 'Easter Monday'),
  holiday('2026-04-25', 'ANZAC Day'),
  holiday('2026-06-08', "King's Birthday"),
  holiday('2026-09-25', 'Friday before AFL Grand Final'),
  holiday('2026-11-03', 'Melbourne Cup Day'),
  holiday('2026-12-25', 'Christmas Day'),
  holiday('2026-12-26', 'Boxing Day'),
  holiday('2026-12-28', 'Additional Boxing Day public holiday'),
  holiday('2027-01-01', "New Year's Day"),
  holiday('2027-01-26', 'Australia Day'),
  holiday('2027-03-08', 'Labour Day'),
  holiday('2027-03-26', 'Good Friday'),
  holiday('2027-03-27', 'Saturday before Easter Sunday'),
  holiday('2027-03-28', 'Easter Sunday'),
  holiday('2027-03-29', 'Easter Monday'),
  holiday('2027-04-25', 'ANZAC Day'),
  holiday('2027-06-14', "King's Birthday"),
  holiday('2027-11-02', 'Melbourne Cup Day'),
  holiday('2027-12-25', 'Christmas Day'),
  holiday('2027-12-26', 'Boxing Day'),
  holiday('2027-12-27', 'Additional Christmas Day public holiday'),
  holiday('2027-12-28', 'Additional Boxing Day public holiday'),
];

export const victoriaHolidayData = {
  lastVerified: '2026-08-30',
  source: 'Business Victoria',
  unconfirmed: '2027 Friday before AFL Grand Final: subject to AFL schedule.',
};
