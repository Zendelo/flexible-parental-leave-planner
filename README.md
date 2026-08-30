# Flexible Parental Leave Planner

An independent, client-side planning tool for estimating how Australian unpaid
parental leave may be split between continuous and flexible leave. It is not a
government service or legal advice.

## Product design

`src/App.tsx` uses progressive disclosure. Simple mode starts blank and asks
only for the child date of birth, continuous-leave start, return date, workday
count and weekdays. Staged return planning is part of the main flow. Extension
timing, public-holiday treatment, statutory accounting and notice dates stay
under Advanced options.

`/terms` and `/privacy` are client-side public pages. `vercel.json` and
`netlify.toml` provide SPA fallbacks for those paths.

## Calculation architecture

- `src/config/parentalLeaveRules.ts` centralises effective-date-aware caps,
  notice periods, the statutory window and source metadata.
- `src/lib/dateUtils.ts` provides UTC date-only utilities.
- `src/lib/parentalLeave.ts` contains pure statutory calculations.
- `src/lib/stagedSchedule.ts` generates real schedule dates from weekdays,
  phases, holiday treatment and the child-based deadline.
- `src/data/victoriaPublicHolidays.ts` contains verified Victorian dates.

Public holidays never change the statutory notional flexible period. They only
affect the generated real-world plan. Victoria is the only supported holiday
jurisdiction. Add another jurisdiction by creating an official data module,
mapping it in the UI, and adding substitute/local-holiday tests.

## Maintenance release checklist

1. Verify the latest Fair Work Act compilation.
2. Verify Fair Work Ombudsman parental-leave guidance.
3. Verify supported public-holiday datasets.
4. Update `rulesLastVerified` and holiday metadata.
5. Run statutory-boundary and scheduling tests.
6. Audit public wording for definitive legal claims and analytics for input capture.
7. Run `npm test`, `npx tsc --noEmit`, and `npm run build`.

## Development and deployment

Run `npm install`, then `npm run dev`. Run `npm test` and `npm run build`
before release. Deploy the generated `dist/` directory to any static host.
Vercel and Netlify configuration is included. If a host, analytics, contact
service or error-reporting service is added, update `/privacy` before release
and ensure calculator inputs are never collected.

## Open source

The Flexible Parental Leave Planner is open source so its calculation logic, legal-rule configuration, public holiday data, and regression tests can be reviewed publicly.

- [View the source code](https://github.com/Zendelo/flexible-parental-leave-planner)
- [Report a calculation issue](https://github.com/Zendelo/flexible-parental-leave-planner/issues/new/choose)

This is an independent guidance and planning tool. It is not legal advice and is not affiliated with or endorsed by the Fair Work Ombudsman, Fair Work Commission, Australian Government, or any state or territory government.

Because legislation and public holiday data can change, forks and old deployments may become outdated. Always check the version's **Rules last verified** date and compare important results with current official sources.

### Official sources

- [Fair Work Ombudsman](https://www.fairwork.gov.au/)
- [Fair Work Act 2009 — Federal Register of Legislation](https://www.legislation.gov.au/C2009A00028/latest/text)

### Local development

```bash
npm install
npm run dev
```

### Validation

```bash
npm test
npx tsc --noEmit
npm run build
```

