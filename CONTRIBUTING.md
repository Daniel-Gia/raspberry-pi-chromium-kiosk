# Contributing

Thanks for contributing to **raspberry-pi-chromium-kiosk**.

> Note
> For the full contribution guide on the web page, go to:
> https://daniel-gia.github.io/raspberry-pi-chromium-kiosk/contribute/first-steps/



## Ground rules

- Be respectful and constructive.
- Prefer small, focused pull requests.

## Create an issue

1. Go to the repo Issues page:
   https://github.com/Daniel-Gia/raspberry-pi-chromium-kiosk/issues
2. Click **New issue**.
3. Provide:
    - it’s a bug:
        - What you expected vs what happened
        - Steps to reproduce
        - Raspberry Pi model + OS version
        - Logs (if relevant):
            - `systemctl status kiosk-browser`
            - `systemctl status admin-panel`
    - it's a feature request:
        - Explain the request

## Make changes and open a Pull Request

### Branch workflow (important)

### Branch naming:

- `feature/<short-description>`
- `fix/<short-description>`
- `docs/<short-description>`

### Steps
1. On GitHub, click **Fork** to create your own copy of the repo.
2. Open **your fork** in GitHub Desktop and clone it.
3. Switch to the **`dev`** branch.
    - If you don’t see it locally, use GitHub Desktop to fetch/pull the latest branches from the remote.
4. Create a new branch named like `feature/...`, `fix/...`, or `docs/...`.
    - Create the branch from `dev` (not `main`).
5. Make your changes locally.
6. Commit your changes in GitHub Desktop.
7. Push the branch to **your fork**.
8. Click **Create Pull Request**.
9. In the PR page, set:
    - **Base repository**: `Daniel-Gia/raspberry-pi-chromium-kiosk`
    - **Base branch**: `dev`
    - **Head repository**: your fork
    - **Compare branch**: your `feature/...` / `fix/...` / `docs/...` branch

> Tip
>
> If you change anything in the **admin panel**, the easiest way to test it on a Raspberry Pi is to build and push your own ARM64 image (e.g. to docker hub), then point the Pi to that image.
>
> 1) Build + push an ARM64 image (run from the `admin-panel/` directory):
>
> ```sh
> docker buildx build --platform linux/arm64 -t ${REPO}:latest -f Dockerfile . --push
> ```
>
> 2) Update the root `docker-compose.yml` to pull **your** image (`${REPO}:latest`).
>
> 3) On the Pi, pull **your fork** (or your branch), run the setup with your image (should work just by updating docker compose)

### PR expectations

- Describe *why* the change is needed and *what* it changes.
- If it affects Raspberry Pi runtime behavior, describe how you tested.
- Update documentation if you change behavior, setup steps, services, or endpoints.

## What to edit (common areas)

- Admin panel (Next.js):
  - `admin-panel/`
- Kiosk runtime scripts/services:
  - `kiosk-browser/start_browser.sh`
  - `kiosk-browser/setup.sh`
  - `kiosk-browser/kiosk-browser.service`
- Setup automation:
  - `setup/setup.sh`
  - `setup/generate-admin-login.sh`
- Docs (MkDocs):
  - `mkdocs.yml`
  - `docs/`
