# Repository Guidelines

## Project Structure & Module Organization

This is a small Vite/React application. `src/App.tsx` owns the planner UI and
`src/index.css` owns its styles. Keep entitlement logic in `src/lib/`: date-only
helpers in `dateUtils.ts`, statutory rules in `parentalLeave.ts`, and the
real-world staged calendar in `stagedSchedule.ts`. `src/data/` holds verified,
editable Victorian public-holiday data. `src/main.tsx` mounts the app.

## Build, Test, and Development Commands

Run `npm install` after cloning, `npm run dev` for the local Vite server,
`npm test` for the Node regression suite, and `npm run build` before handoff.
The build command performs strict TypeScript checking and creates a production
bundle. Do not commit generated `dist/` output or add dependencies when React,
TypeScript, or native browser controls already cover the need.

## Coding Style & Naming Conventions

Use TypeScript, two-space indentation, semicolons, single quotes, and trailing
commas. Name React components in `PascalCase`, functions and variables in
`camelCase`, and constants in `UPPER_SNAKE_CASE`. Preserve UTC calendar helpers
(`parseIsoDate`, `addDaysUtc`, `addMonthsUtc`) rather than local-time `Date`
mutation, because daylight-saving boundaries matter.

## Testing Guidelines

Keep calculation helpers deterministic and extend `*.test.ts` beside the
affected module. Cover day-cap cohorts, notional periods, extension timing,
holiday treatment, and the exclusive 24-month cutoff. For a UI smoke test,
start from blank inputs and enter dates plus a work pattern. Keep scenario
fixtures neutral and separate from production defaults.

## Change, Commit, and Pull Request Guidelines

Use concise imperative commit subjects, for example `Fix extension deadline
boundary`. In a pull request, state the scenario and rule changed, list
validation performed, and include a screenshot for visible UI changes. Do not
present the calculator as legal advice; preserve its limitations when changing
entitlement logic.
