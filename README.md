# gxp-demo-app

A small web application used to exercise the
[GxP DevOps framework](https://github.com/Kriss-test-org/gxp-devops-framework). It evaluates a measured result
against specification limits (PASS / OOS) and shows which release and environment it is running.
Requirements are in [docs/requirements.md](docs/requirements.md).

## Branches

| Branch | Holds | Updated by |
|---|---|---|
| `develop` | Work in progress (Lovable; its preview is DEV) | Development |
| `stage` | What is validated in STAGING | Pull requests from `develop` only |
| `main` | Exactly what runs in PRODUCTION | The release run only |

## Change a feature

1. **Request.** Open an issue describing the change in your own words.
2. **Approve.** A change approver from [.gxp/roles.yml](.gxp/roles.yml) (not the requester) comments:
   ```
   /approve
   impact: low
   path: targeted
   type: feature
   requirements: URS-005, URS-001
   reason: Display-only change; the evaluation is unchanged.
   ```
   `type` decides the next version: `fix` → 0.2.1, `feature` → 0.3.0, `breaking` → 1.0.0.
3. **Develop** on `develop`. New requirements go into `docs/requirements.md`, with tests named after them.
4. **Pull request** from `develop` to `stage` with `Closes #<issue>` in the description. A change approver who
   did not write the code approves it; then the author merges it. The merge starts **GxP release candidate N**.
5. **Verify.** When the run waits at *Verification*, the verifier checks staging, clicks
   **Review deployments**, selects `gxp-verification`, writes `PASS <reference>` and approves.
6. **Approve.** A release approver who did not write code for it or verify it approves `gxp-production`.
   The run promotes the same image, moves `main`, tags `vX.Y.Z`, publishes the release with the PDF report
   and closes the issue.

If a gate failed only because of a missing or wrong approval comment, use **Re-run failed jobs** and approve
again; the image is not rebuilt.

## Run locally

```bash
npm test
docker build -t gxp-demo-app:local .
docker run --rm -p 8080:8080 -e APP_ENVIRONMENT=local gxp-demo-app:local
```

Then open http://localhost:8080 and http://localhost:8080/version.
