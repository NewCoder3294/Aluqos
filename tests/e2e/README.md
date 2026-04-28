# E2E Tests

Playwright specs covering full user flows.

## Linear E2E mock

The `linear-connect-flow.spec.ts` test depends on a mock Linear OAuth server
that returns a fixed access token and a paginated issues list. The mock lives
under `fixtures/mock-linear/` and is started by `pnpm dev:mock-linear` before
running the E2E. Building the mock is a follow-up task.

If the mock isn't running, the test redirects to real Linear and fails at the
authorize step (no test client). Set `SKIP_LINEAR_E2E=1` in CI when the mock
isn't available.
