# Flexible Parental Leave Planner

[![CI](https://github.com/Zendelo/flexible-parental-leave-planner/actions/workflows/ci.yml/badge.svg)](https://github.com/Zendelo/flexible-parental-leave-planner/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

An independent, client-side planning tool for estimating how Australian unpaid
parental leave may be split between continuous and flexible leave.

**Guidance only — not legal advice.** This project is not a government service
and is not affiliated with or endorsed by the Fair Work Ombudsman, Fair Work
Commission, Australian Government, or any state or territory government.

## What the planner does

The public interface uses progressive disclosure.

Simple mode starts blank and asks only for:

- the child's date of birth;
- continuous unpaid parental leave start;
- planned return date;
- intended workday count; and
- intended weekdays.

It then estimates how long a reduced working week could potentially be
supported by flexible unpaid parental leave.

Staged return planning is part of the main flow. More technical features,
including extension timing, public-holiday treatment, statutory accounting and
notice dates, remain under **Advanced options**.

`/terms` and `/privacy` are client-side public pages.

## Calculation architecture

- `src/config/parentalLeaveRules.ts` centralises effective-date-aware caps,
  notice periods, the statutory window and source metadata.
- `src/lib/dateUtils.ts` provides UTC date-only utilities.
- `src/lib/parentalLeave.ts` contains pure statutory calculations.
- `src/lib/stagedSchedule.ts` generates real schedule dates from weekdays,
  phases, holiday treatment and the child-based deadline.
- `src/data/victoriaPublicHolidays.ts` contains verified Victorian dates.

Public holidays never change the statutory notional flexible period. They only
affect the generated real-world plan.

Victoria is currently the only supported public-holiday jurisdiction. New
jurisdictions should use official government data, clear effective dates, and
regression tests.

## Accuracy and legal status

The planner provides estimates and scenarios, not determinations of legal
entitlement.

User-facing wording should distinguish:

- calculated dates and arithmetic;
- planning assumptions;
- circumstances requiring or potentially requiring employer agreement; and
- matters the calculator cannot determine.

Government legislation and official Fair Work guidance remain authoritative.

Rules can change. Check `rulesLastVerified` in
`src/config/parentalLeaveRules.ts` and verify current official sources before a
public release.

## Official sources

Primary sources include:

- [Fair Work Ombudsman](https://www.fairwork.gov.au/)
- [Fair Work Act 2009 — Federal Register of Legislation](https://www.legislation.gov.au/C2009A00028/latest/text)
- official state or territory public-holiday sources for supported jurisdictions

Do not use blogs, forum posts, law-firm summaries, or AI-generated text as the
sole authority for legally significant calculation changes.

## Privacy

The application is designed so calculator inputs remain in the browser. The
current source does not configure analytics, session replay, an application
backend, or error-reporting telemetry.

Do not add tooling that captures child DOBs, leave dates, return dates, work
patterns, or extension-request dates without an explicit privacy review and an
update to the public Privacy page.

A hosting provider may still process ordinary technical request information
needed to serve the site.

## Development

```bash
npm install
npm run dev
```

## Validation

Before opening a pull request or publishing a release:

```bash
npm test
npx tsc --noEmit
npm run build
```

CI runs the same checks on pushes and pull requests.

## Deployment

The generated `dist/` directory can be hosted as a static site.

Repository configuration is available for:

- Cloudflare Workers Static Assets
- Vercel
- Netlify

For Cloudflare instructions, see [CLOUDFLARE_DEPLOYMENT.md](CLOUDFLARE_DEPLOYMENT.md).

The Cloudflare deployment workflow skips the deploy step when its required
GitHub secrets have not yet been configured, while still running tests and the
production build.

## Open source

The project is open source so the calculation logic, legal-rule configuration,
public-holiday data, and regression tests can be independently reviewed.

- [View source](https://github.com/Zendelo/flexible-parental-leave-planner)
- [Report a calculation or legal-data issue](https://github.com/Zendelo/flexible-parental-leave-planner/issues/new/choose)

Forks and old deployments may become outdated as legislation and public-holiday
data change. A fork should retain clear rule-verification dates and its own
disclaimer.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

For security vulnerabilities, follow [SECURITY.md](SECURITY.md) rather than
posting vulnerability details in a public issue.

Community participation is covered by [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Maintenance release checklist

Before a public release:

1. Verify the latest Fair Work Act compilation.
2. Verify relevant Fair Work Ombudsman parental-leave guidance.
3. Verify all supported public-holiday datasets.
4. Update `rulesLastVerified` and holiday verification metadata.
5. Run statutory-boundary and scheduling regression tests.
6. Audit public wording for definitive legal claims.
7. Verify analytics/logging do not capture calculator inputs.
8. Run `npm test`, `npx tsc --noEmit`, and `npm run build`.
9. Review open calculation, legal-data, privacy and security issues.

## Licence

Source code is available under the [MIT License](LICENSE).

The MIT licence governs reuse of the source code. The deployed website's Terms
of Use govern use of the hosted planning service.
