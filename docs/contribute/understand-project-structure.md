# Project structure

This repository is split into a few clearly separated parts:

- **Chromium Kiosk** (systemd service + shell scripts that run on boot)
- **Admin panel** (Next.js app, run using Docker Compose)
- **Database** (SQLite stores the kiosk URL and admin account)
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
│  ├─ lib/
│  ├─ prisma.config.ts
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  └─ migrations/
│  └─ app/
│     ├─ api/
│     │  ├─ auth/[...nextauth]/route.ts
│     │  ├─ create-login/route.ts
│     │  └─ url/route.ts
│     ├─ components/UrlForm.tsx
│     ├─ login/
│     ├─ create-login/
│     ├─ show-ip/
│     └─ page.tsx
├─ kiosk-browser/
│  ├─ kiosk-browser.service
│  ├─ setup.sh
│  └─ start_browser.sh
├─ data/                 (generated at startup, ignored by Git)
│  └─ kiosk.db
├─ setup/
│  ├─ admin-panel.service
│  ├─ admin-panel-dev.service
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

### `data/`

`kiosk.db` stores the URL and admin account in SQLite. Prisma manages the schema and migrations in `admin-panel/prisma/`. The panel uses Prisma to access the database; the kiosk reads the URL using `sqlite3`. With no saved URL, the kiosk opens `http://localhost/show-ip`.

Docker mounts this directory at `/data` to preserve settings and credentials across container replacement. Keep it when updating or backing up an installation.

### `kiosk-browser/`
Everything related to starting Chromium in kiosk mode.

- `start_browser.sh`
    - Reads the URL from `data/kiosk.db` and launches Chromium.
- `kiosk-browser.service`
    - systemd service template to run the kiosk on boot.
- `setup.sh`
    - Installs/enables the kiosk service and sets up kiosk prerequisites.

### `admin-panel/`

A Next.js app that provides:

- Authentication (NextAuth route)
- A create-login page that is available until the first admin account exists
- A URL endpoint used to read/write the kiosk URL
- A small UI to update the kiosk URL remotely

This is built and deployed as a container image. Local dev and start commands generate Prisma Client and apply migrations automatically. Docker generates the client at build time and applies migrations at startup.

### `docker-compose.yml`

Runs the admin panel container

### `setup/`

Automation for a fresh Pi install.

- `install.sh`
    - The script used when installing the project with 
    ```sh 
    curl -sSL https://raw.githubusercontent.com/Daniel-Gia/raspberry-pi-chromium-kiosk/main/setup/install.sh | sudo bash
    ```
- `setup.sh`
    - Installs dependencies, prepares persistent storage, and generates the session secret in `.env`. The first admin account is created through the browser and stored with a bcrypt password hash in SQLite.
- `admin-panel.service`
    - systemd service template for running the docker container with the admin panel on boot.
- `admin-panel-dev.service`
    - systemd service template for running the admin panel in development mode.
