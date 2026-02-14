# Create a PR

## Branch workflow (important)

### Branch naming:

- `feature/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`

### Steps
1. On GitHub, click **Fork** to create your own copy of the repo.
2. Open **your fork** in GitHub Desktop and clone it.
3. Switch to the **`main`** branch.
    - If you don’t see it locally, use GitHub Desktop to fetch/pull the latest branches from the remote.
4. Create a new branch named like `feature/...`, `fix/...`, or `docs/...`.
    - Create the branch from `main`.
5. Make your changes locally.
6. Commit your changes in GitHub Desktop.
7. Push the branch to **your fork**.
8. Click **Create Pull Request**.
9. In the PR page, set:
    - **Base repository**: `Daniel-Gia/raspberry-pi-chromium-kiosk`
    - **Base branch**: `dev`
    - **Head repository**: your fork
    - **Compare branch**: your `feature/...` / `fix/...` / `docs/...` branch

!!! tip "Test admin-panel changes on your Raspberry Pi"

    If you change anything in the **admin panel**, the easiest way to test it is to follow this steps [test changes locally](/contribute/test-locally)

### PR expectations

- Describe *why* the change is needed and *what* it changes.
- If it affects Raspberry Pi runtime behavior, describe how you tested.
- Update documentation if you change behavior, setup steps, services, or endpoints.
