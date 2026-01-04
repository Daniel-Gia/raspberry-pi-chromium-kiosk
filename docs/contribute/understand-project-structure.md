# Project structure

This repository is split into a few clearly separated parts:

- **Chromium Kiosk** (systemd service + shell scripts that run on boot)
- **Admin panel** (Next.js app, run using Docker Compose)
- **Settings** (the kiosk URL)
- **Setup** (scripts + service installation)

## Folder / file tree

```text
raspberry-pi-chromium-kiosk/
├─ docker-compose.yml
├─ mkdocs.yml
├─ README.md
├─ admin-panel/
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ next.config.ts
│  ├─ middleware.ts
│  └─ app/
│     ├─ api/
│     │  ├─ auth/[...nextauth]/route.ts
│     │  └─ url/route.ts
│     ├─ components/UrlForm.tsx
│     ├─ login/
│     ├─ show-ip/
│     └─ page.tsx
├─ kiosk-browser/
│  ├─ kiosk-browser.service
│  ├─ setup.sh
│  └─ start_browser.sh
├─ settings/
│  └─ default_url.txt
├─ setup/
│  ├─ admin-panel.service
│  ├─ admin-panel-dev.service
│  ├─ generate-admin-login.sh
│  ├─ install.sh
│  └─ setup.sh
└─ docs/
   ├─ index.md
   ├─ getting-started.md
   └─ contribute/
      ├─ create-a-pr.md
      ├─ setup-environment.md
      └─ ...
```

## Key parts explained

### `settings/`

- `default_url.txt`
    - The URL the kiosk opens.
    - The admin panel updates this file.
    - The kiosk browser reads this file when launching Chromium.

### `kiosk-browser/`
Everything related to starting Chromium in kiosk mode.

- `start_browser.sh`
    - Reads `settings/default_url.txt` and launches Chromium.
- `kiosk-browser.service`
    - systemd service template to run the kiosk on boot.
- `setup.sh`
    - Installs/enables the kiosk service and sets up kiosk prerequisites.

### `admin-panel/`

A Next.js app that provides:

- Authentication (NextAuth route)
- A URL endpoint used to read/write the kiosk URL
- A small UI to update the kiosk URL remotely

This is built and deployed as a container image.

### `docker-compose.yml`

Runs the admin panel container

### `setup/`

Automation for a fresh Pi install.

- `install.sh`
    - The script used when installing the project with 
    ```sh 
    curl -sSL https://raw.githubusercontent.com/Daniel-Gia/raspberry-pi-chromium-kiosk/main/setup install.sh | sudo bash -s -- <username> <password>
    ```
- `setup.sh`
    - Sets up the environment.
- `generate-admin-login.sh`
    - Creates the admin credentials used by the admin panel.
- `admin-panel.service`
    - systemd service template for running the docker container with the admin panel on boot.
- `admin-panel-dev.service`
    - systemd service template for running the admin panel in development mode.