# Security Policy

## Supported version

Security fixes are applied to the current public version of the Flexible Parental Leave Planner.

## Reporting a security issue

Please do **not** disclose a suspected security vulnerability in a public GitHub issue.

Use GitHub's private vulnerability reporting feature for this repository if it is enabled:

**Security → Report a vulnerability**

If private vulnerability reporting is not available, contact the repository maintainer privately through the contact method listed on the project's public website or GitHub profile.

Please include, where possible:

- a description of the issue;
- steps to reproduce it;
- affected files or routes;
- the potential impact;
- any suggested mitigation.

Do not include real users' personal information in a report.

## Sensitive calculator inputs

Treat child's date of birth, parental leave dates, return-to-work dates, work patterns, and extension request dates as potentially personal information.

Security, analytics, logging, crash reporting, and session replay features should not capture these values.

## Scope

Examples of security issues include cross-site scripting, unsafe rendering of user-controlled content, exposed secrets or API keys, vulnerable production dependencies, unintended transmission/storage of calculator inputs, and insecure deployment configuration.

Calculation errors, outdated legislation, and public holiday data issues should instead use the relevant public issue template.

## Disclosure

Please allow reasonable time for investigation and remediation before public disclosure.

This policy is not a bug bounty program and does not promise payment for reports.
