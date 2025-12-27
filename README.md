# Raspberry Pi Chromium Kiosk

A Raspberry Pi kiosk setup that boots straight into **Chromium in kiosk mode**, plus a **web-based admin panel** (accessible by IP in a browser from any device on the network) that lets you **change the kiosk URL remotely**.

## Setup (Raspberry Pi OS Lite)

1. Install **Raspberry Pi OS Lite** (using the official Raspberry Pi imaging tool)
2. Install git:
   ```sh
   sudo apt install git
   ```
3. Clone the repository:
   ```sh
   sudo git clone https://github.com/Daniel-Gia/raspberry-pi-chromium-kiosk.git
   ```
4. Go to the setup folder:
   ```sh
   cd raspberry-pi-chromium-kiosk/setup
   ```
5. Make the setup script executable:
   ```sh
   sudo chmod +x setup.sh
   ```
6. Run the setup:
   ```sh
   sudo ./setup.sh
   ```
7. Generate admin panel login credentials:
   ```sh
   sudo ./generate-admin-login.sh {username} {password}
   ```
8. Reboot:
   ```sh
   sudo reboot
   ```

After reboot:
- The **kiosk browser** should start automatically on the Pi.
- The **admin panel** runs via Docker Compose (using host networking).

## How to changing the kiosk URL

- You can open the **admin panel from any device on the same network** by visiting the Pi’s IP address in a browser:
    - `http://<pi-ip>`
    - Example: `http://192.168.1.50`

## Project folder structure

- `docker-compose.yml`  
  Runs the **admin-panel** using the image from https://hub.docker.com/r/danielgiacobelli/raspberry-pi-chromium-kiosk-admin-panel

- `settings/`  
  - `default_url.txt` — the URL the kiosk opens on start (and what the admin panel edits)

- `kiosk-browser/`  
  Everything related to launching Chromium in kiosk mode on the Pi.
  - `start_browser.sh` — reads `settings/default_url.txt` and launches Chromium
  - `kiosk-browser.service` — service template for running the kiosk on boot
  - `setup.sh` — setups the kiosk browser

- `admin-panel/`  
  The web UI/API for authentication and setting the kiosk URL (Next.js).

- `setup/`

## License

Licensed under the **Apache License 2.0 (Apache-2.0)**. See `LICENSE` and `NOTICE`.

## How to build the admin panel docker image
See `admin-panel/README.md`.