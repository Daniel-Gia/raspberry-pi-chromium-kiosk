# Test Locally

To test your changes on a Raspberry Pi without building Docker images, you can use the development setup mode. This runs the Admin Panel directly on the host using `npm run dev`, allowing for faster testing.

## Prerequisites

- A Raspberry Pi with Raspberry Pi OS installed.
- SSH access to the Pi.
- Your fork of the repository with your changes pushed to a branch.

## Steps

1.  **Clone your fork and checkout your branch:**

    SSH into your Raspberry Pi and run:

    ```sh
    # Replace with your fork URL and branch name
    git clone https://github.com/YOUR_USERNAME/raspberry-pi-chromium-kiosk.git
    cd raspberry-pi-chromium-kiosk
    git checkout your-feature-branch
    ```

2.  **Run the setup in Development Mode:**

    Navigate to the setup directory and run the script with the `--dev` flag:

    ```sh
    cd setup
    sudo chmod +x setup.sh
    sudo ./setup.sh --dev
    ```

    This will:
    
    - Install Node.js 22 if missing or upgrade an older version (minimum 22.12).
    - Install `npm` dependencies for the Admin Panel.
    - Install `sqlite3`, prepare `data/`, and generate a persistent session secret in `.env`.
    - Configure the `admin-panel-dev` systemd service to run via `npm run dev` (instead of Docker).
    - Disable the production Docker service.

3.  **Reboot:**

    Reboot the Pi to start the Kiosk Browser and the Admin Panel service:

    ```sh
    sudo reboot
    ```

## Verification

After rebooting, the Kiosk Browser should launch. You can access the Admin Panel from another computer on the same network:

- URL: `http://<RASPBERRY_PI_IP>`

Since the Admin Panel is running with `npm run dev`, any changes you make to the files in `~/raspberry-pi-chromium-kiosk/admin-panel` on the Pi will be reflected immediately (or after a page refresh).
