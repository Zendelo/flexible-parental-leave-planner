# Public launch checklist

Use this checklist before pointing a public domain at the planner.

## Repository

- [ ] CI is green.
- [ ] Cloudflare deployment is green or intentionally disabled.
- [ ] `npm test` passes.
- [ ] `npx tsc --noEmit` passes.
- [ ] `npm run build` passes.
- [ ] No personal scenario names, correspondence or unnecessary identifying data are present.
- [ ] No placeholder email addresses such as `issues@example.com` remain.
- [ ] `MANIFEST.txt` and temporary extraction files are removed.
- [ ] MIT `LICENSE`, `CONTRIBUTING.md`, `SECURITY.md` and issue templates are present.

## Legal and accuracy

- [ ] Verify the current Fair Work Act compilation.
- [ ] Verify relevant Fair Work Ombudsman parental-leave guidance.
- [ ] Verify each implemented flexible-day cap and effective date.
- [ ] Verify Section 76 timing logic and source references.
- [ ] Verify the current statutory flexible-leave window.
- [ ] Verify supported public-holiday data.
- [ ] Update `rulesLastVerified`.
- [ ] Update public-holiday `lastVerified` metadata.
- [ ] Main results are labelled as estimates/planning guidance.
- [ ] Employer-agreement scenarios are qualified appropriately.
- [ ] The site does not imply government affiliation or endorsement.
- [ ] Terms of Use and Privacy routes load correctly on the production host.
- [ ] Print output contains the short planning/not-legal-advice disclaimer.

## Privacy

- [ ] Calculator inputs remain client-side.
- [ ] No analytics capture dates, work patterns, extension request dates or other calculator inputs.
- [ ] Session replay is absent or fully masks calculator inputs.
- [ ] Error reporting does not attach calculator state.
- [ ] The Privacy page accurately describes the production hosting and data flow.
- [ ] A private route exists for security reports; public issues are not used for vulnerabilities.

## Cloudflare

- [ ] `CLOUDFLARE_API_TOKEN` is configured with minimum required permissions.
- [ ] `CLOUDFLARE_ACCOUNT_ID` is configured.
- [ ] The first Workers deployment succeeds.
- [ ] `/`, `/terms`, and `/privacy` work directly and on refresh.
- [ ] HTTPS is enabled.
- [ ] The custom domain, if any, does not imply government affiliation.
- [ ] DNS and certificate status are healthy.

## Open source

- [ ] README has a working CI badge.
- [ ] README explains that the MIT licence applies to source code.
- [ ] README links to Terms and privacy concepts appropriately.
- [ ] Contribution guidance requires primary official sources for legal changes.
- [ ] Dependabot is enabled.
- [ ] Security reporting instructions are usable.
- [ ] GitHub issue templates render correctly.

## Final manual test

Test at minimum:

1. blank first load;
2. a 2-day plan;
3. a 3-day plan;
4. a 4-day plan;
5. staged 3 -> 4;
6. earlier/later return comparison;
7. Section 76 advanced scenario;
8. Victorian holiday interaction;
9. statutory deadline;
10. mobile layout;
11. print;
12. `/terms`;
13. `/privacy`;
14. issue-reporting links.
