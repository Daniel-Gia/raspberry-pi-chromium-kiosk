# Project structure

This repository is split into a few clearly separated parts:

- **Kiosk runtime** (systemd service + shell scripts)
- **Admin panel** (Next.js app, deployed via Docker Compose)
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
│  ├─ generate-admin-login.sh
│  └─ setup.sh
└─ docs/
   ├─ index.md
   ├─ getting-started.md
   └─ project-structure.md
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

- `setup.sh`
- `generate-admin-login.sh`
    - Creates the admin credentials used by the admin panel.
- `admin-panel.service`
    - systemd service template for running the docker container with the admin panel on boot