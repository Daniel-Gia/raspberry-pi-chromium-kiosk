#!/bin/bash
# chmod +x setup.sh
# Usage: ./setup.sh [--dev]

set -euo pipefail

SETUP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SETUP_DIR/.." && pwd)"

DEV_MODE=false
if [ "${1:-}" == "--dev" ]; then
    DEV_MODE=true
    echo ">> DEV MODE ENABLED: Will setup admin-panel using npm (host) instead of Docker."
fi

echo "== Raspberry Pi Chromium Kiosk Project Setup =="

echo "1) Installing required packages (openssl, htpasswd)..."
sudo apt-get update
sudo apt-get install -y openssl apache2-utils

if [ "$DEV_MODE" = true ]; then
    echo "2) Installing Node.js 20 (Dev Mode)..."
    if ! command -v node &> /dev/null; then
        # Install Node.js 20.x
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        echo "Node.js is already installed."
    fi
else
    if ! command -v docker &> /dev/null; then
        echo "2) Installing Docker..."
        curl -sSL https://get.docker.com | sh
    else
        echo "2) Docker is already installed. Skipping installation."
    fi

    echo "3) Enabling Docker..."
    sudo systemctl enable --now docker

    echo "4) Pulling latest Docker images..."

    # Ensure .env file is used for Docker Compose
    if [ -f "$REPO_DIR/.env" ]; then
      echo "Using .env file for Docker Compose."
      export $(grep -v '^#' "$REPO_DIR/.env" | xargs) # export variables from .env
      echo "IMAGE_TAG being used: $IMAGE_TAG"
    else
      echo ".env file not found. Using default 'latest' tag for Docker Compose."
    fi

    docker compose --env-file "$REPO_DIR/.env" -f "$REPO_DIR/docker-compose.yml" pull
fi

echo "5) Running kiosk-browser setup..."
chmod +x "$REPO_DIR/kiosk-browser/setup.sh"
"$REPO_DIR/kiosk-browser/setup.sh"

echo "6) Making generate-admin-login.sh executable..."
chmod +x "$REPO_DIR/setup/generate-admin-login.sh"

if [ "$DEV_MODE" = true ]; then
    echo "7) Installing admin-panel dev service (npm)..."
    
    echo "   Installing npm dependencies in admin-panel/..."
    cd "$REPO_DIR/admin-panel"
    npm install

    SERVICE_PATH="/etc/systemd/system/admin-panel-dev.service"
    TEMPLATE_PATH="$REPO_DIR/setup/admin-panel-dev.service"

    if [ ! -f "$TEMPLATE_PATH" ]; then
      echo "Missing template: $TEMPLATE_PATH"
      exit 1
    fi

    # Disable production service if it exists to avoid port conflicts
    sudo systemctl disable --now admin-panel.service 2>/dev/null || true

    sudo sed -e "s|@REPO_DIR@|$REPO_DIR|g" "$TEMPLATE_PATH" | sudo tee "$SERVICE_PATH" > /dev/null

    sudo systemctl daemon-reload
    sudo systemctl enable admin-panel-dev.service
else
    echo "7) Installing admin-panel docker compose systemd service..."
    SERVICE_PATH="/etc/systemd/system/admin-panel.service"
    TEMPLATE_PATH="$REPO_DIR/setup/admin-panel.service"

    if [ ! -f "$TEMPLATE_PATH" ]; then
      echo "Missing template: $TEMPLATE_PATH"
      exit 1
    fi

    # Disable dev service if it exists
    sudo systemctl disable --now admin-panel-dev.service 2>/dev/null || true

    sudo sed -e "s|@REPO_DIR@|$REPO_DIR|g" "$TEMPLATE_PATH" | sudo tee "$SERVICE_PATH" > /dev/null

    sudo systemctl daemon-reload
    sudo systemctl enable admin-panel.service
fi

echo "-------------------------------------------------------"
echo "Done! Now please run the generate-admin-login.sh script to create admin login credentials."
echo "After that reboot the system to start the kiosk browser. (sudo reboot)"
echo "-------------------------------------------------------"