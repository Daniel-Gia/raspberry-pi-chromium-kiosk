#!/bin/bash
# chmod +x setup.sh

set -euo pipefail

SETUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SETUP_DIR/.." && pwd)"

echo "== Raspberry Pi Chromium Kiosk Project Setup =="

echo "1) Installing required packages (openssl, htpasswd)..."
sudo apt-get update
sudo apt-get install -y openssl apache2-utils

if ! command -v docker &> /dev/null; then
    echo "2) Installing Docker..."
    curl -sSL https://get.docker.com | sh
else
    echo "2) Docker is already installed. Skipping installation."
fi

echo "3) Enabling Docker..."
sudo systemctl enable --now docker

echo "4) Pulling latest Docker images..."
docker compose -f "$REPO_DIR/docker-compose.yml" pull

echo "5) Running kiosk-browser setup..."
chmod +x "$REPO_DIR/kiosk-browser/setup.sh"
"$REPO_DIR/kiosk-browser/setup.sh"

echo "6) Making generate-admin-login.sh executable..."
chmod +x "$REPO_DIR/setup/generate-admin-login.sh"

echo "7) Installing admin-panel docker compose systemd service..."
SERVICE_PATH="/etc/systemd/system/admin-panel.service"
TEMPLATE_PATH="$REPO_DIR/setup/admin-panel.service"

if [ ! -f "$TEMPLATE_PATH" ]; then
  echo "Missing template: $TEMPLATE_PATH"
  exit 1
fi

sudo sed -e "s|@REPO_DIR@|$REPO_DIR|g" "$TEMPLATE_PATH" | sudo tee "$SERVICE_PATH" > /dev/null

sudo systemctl daemon-reload
sudo systemctl enable admin-panel.service

echo "-------------------------------------------------------"
echo "Done! Now please run the generate-admin-login.sh script to create admin login credentials."
echo "After that reboot the system to start the kiosk browser. (sudo reboot)"
echo "-------------------------------------------------------"