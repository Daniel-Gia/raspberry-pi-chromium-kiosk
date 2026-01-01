# How to get started

## Prerequisites

- A Raspberry Pi with **Raspberry Pi OS Lite** installed
- Network access (LAN/Wi‑Fi)
- A display connected to the Pi

## Install
!!! note "Terminal access"
    You’ll need terminal access to the Pi for the steps below — either connect a keyboard for a local terminal, or SSH into the Pi from another machine.

1. Install Git:
    ```sh
    sudo apt update
    sudo apt install git
    ```

2. Clone the repository:
   ```sh
   sudo git clone https://github.com/Daniel-Gia/raspberry-pi-chromium-kiosk.git
   ```

3. Run the setup script:
   ```sh
   cd raspberry-pi-chromium-kiosk/setup
   sudo chmod +x setup.sh
   sudo ./setup.sh
   ```

4. Generate admin panel login credentials:
   ```sh
   sudo ./generate-admin-login.sh {username} {password}
   ```

5. Reboot:
   ```sh
   sudo reboot
   ```

## After reboot
- The **kiosk browser** should start automatically.
- The **admin panel** runs via Docker Compose (using host networking).

## Open the admin panel
From any device on the same network, open:

- `http://<pi-ip>`
- Example: `http://192.168.1.50`

If you don’t know the Pi’s IP address, the kiosk will display a **local page showing the Pi’s IP addresses** at the beginning (before any kiosk URL is configured). Use one of those IPs in the URL above.

## Change the kiosk URL
To change the kiosk URL, open the **admin panel**, log in, and update the URL there.

## Troubleshooting (quick)
- If the admin panel isn’t reachable, ensure the Pi and your device are on the same network.
- If Chromium doesn’t start, verify the kiosk service is enabled and check system logs (`systemctl status kiosk-browser`).
