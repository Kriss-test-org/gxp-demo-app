# User requirements: gxp-demo-app

Demo requirements for exercising the GxP DevOps framework. Automated tests reference these IDs
in their names (for example `[URS-001] limits are inclusive`), so test results trace back to
requirements. Impact assessments list the IDs a change affects.

| ID | Requirement | GxP critical |
|---|---|---|
| URS-001 | A result that lies within the inclusive specification limits, after rounding to the specified number of decimals, is classified as PASS. | Yes |
| URS-002 | A result outside the specification limits, after rounding, is classified as OOS (out of specification). | Yes |
| URS-003 | Invalid input (non-numeric results, inverted limits, invalid decimals) is rejected and no classification is shown. | Yes |
| URS-004 | The application shows which release and environment it is running, and exposes its build identity at `/version`. | No |
