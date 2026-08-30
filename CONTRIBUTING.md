# Contributing

Thanks for helping improve the Flexible Parental Leave Planner.

This project is an independent, open-source guidance and planning tool for Australian unpaid parental leave and gradual return-to-work scenarios. It is not legal advice and is not affiliated with or endorsed by the Fair Work Ombudsman, Fair Work Commission, Australian Government, or any state or territory government.

## Before contributing

Please:

1. Search existing issues and pull requests.
2. Keep changes focused and easy to review.
3. Do not introduce personal or employer-identifying information into examples, tests, fixtures, screenshots, or documentation.
4. Use official primary sources for legally significant rules and public holiday data.
5. Add or update tests for any calculation change.

## Development setup

```bash
npm install
npm run dev
```

Before opening a pull request, run:

```bash
npm test
npx tsc --noEmit
npm run build
```

If linting or formatting scripts are configured in `package.json`, run those too.

## Calculation changes

Changes to entitlement logic require a higher standard of review than ordinary UI changes.

For any change to legally significant calculation logic:

- identify the exact rule being changed;
- cite an official source in the pull request;
- include the relevant effective date;
- update central rule metadata where applicable;
- add regression tests for the changed rule and its boundaries;
- explain whether historical scenarios are affected.

Preferred official sources include:

- Federal Register of Legislation: <https://www.legislation.gov.au/>
- Fair Work Ombudsman: <https://www.fairwork.gov.au/>
- official state or territory government public holiday sources.

Do not use blogs, forum posts, law-firm summaries, or AI-generated text as the sole authority for a calculation rule.

## Public holiday data

When adding or updating public holiday data:

- use an official government source;
- include the jurisdiction;
- distinguish statewide from local/regional holidays;
- distinguish confirmed from unconfirmed dates;
- never guess a future date that has not been officially published;
- update the dataset's `lastVerified` metadata;
- add tests for holidays that affect generated flexible-leave dates.

## User-facing wording

The application must not present estimates as definitive legal conclusions.

Prefer wording such as:

- "Estimated"
- "Potentially available"
- "Based on the information entered"
- "If agreed"
- "Employer agreement may be required"

Avoid wording such as:

- "Guaranteed entitlement"
- "Your request is valid"
- "Your employer must approve"
- "Official Fair Work calculator"

## Privacy

Do not add analytics, logging, telemetry, session replay, or error reporting that captures child DOB, leave dates, return dates, proposed work weekdays, extension request dates, or other user-entered employment information.

Any proposed change to data collection should be documented explicitly in the pull request and reflected in the Privacy Policy before release.

## Tests

Please add tests when fixing bugs or changing behaviour. Important regression areas include flexible-day cohort boundaries, continuous vs flexible leave calculations, Section 76 timing scenarios, staged return schedules, public holiday interactions, the 24-month statutory boundary, daylight-saving/date-only arithmetic, and invalid input handling.

A bug fix should normally include a test that fails before the fix and passes after it.

## Pull requests

A good pull request includes:

- a concise description of the problem;
- what changed;
- why the change is correct;
- screenshots for meaningful UI changes;
- official sources for legal or public-holiday changes;
- tests added or updated;
- confirmation that tests, TypeScript, and production build pass.

## Public release checklist

Before a public release:

1. Verify the current Fair Work Act.
2. Verify relevant Fair Work Ombudsman guidance.
3. Verify all supported public holiday datasets.
4. Update `rulesLastVerified` and holiday verification dates.
5. Run the complete regression suite.
6. Run TypeScript checking and the production build.
7. Audit UI wording for overly definitive legal claims.
8. Verify analytics and logging do not capture calculator inputs.
9. Review outstanding calculation or legal-source issues.

## Licence

By contributing, you agree that your contribution may be distributed under the project's MIT License.
