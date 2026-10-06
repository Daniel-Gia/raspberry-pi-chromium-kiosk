#!/bin/bash

# Usage: curl -sSL https://raw.githubusercontent.com/Daniel-Gia/raspberry-pi-chromium-kiosk/main/setup/install.sh | sudo bash

set -euo pipefail

REPO_OWNER="Daniel-Gia"
REPO_NAME="raspberry-pi-chromium-kiosk"

# Determine install directory
if [ -n "${SUDO_USER:-}" ]; then
    USER_HOME=$(getent passwd "$SUDO_USER" | cut -d: -f6)
    INSTALL_DIR="$USER_HOME/$REPO_NAME"
else
    INSTALL_DIR="/opt/$REPO_NAME"
fi

echo "Installing to: $INSTALL_DIR"

if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root. Please use sudo."
    exit 1
fi

echo "== Raspberry Pi Chromium Kiosk =="

echo "Installing dependencies..."
apt-get update
apt-get install -y curl tar

# Get the latest release
echo "Fetching latest release info..."
LATEST_RELEASE_DATA=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/releases/latest")
DOWNLOAD_URL=$(echo "$LATEST_RELEASE_DATA" | grep '"tarball_url":' | sed -E 's/.*"([^"]+)".*/\1/')
RELEASE_TAG=$(echo "$LATEST_RELEASE_DATA" | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$DOWNLOAD_URL" ]; then
    echo "Warning: Could not find the latest release. Downloading the 'main' branch."
    DOWNLOAD_URL="https://github.com/$REPO_OWNER/$REPO_NAME/archive/refs/heads/main.tar.gz"
    RELEASE_TAG="latest"
fi

echo "Downloading from: $DOWNLOAD_URL"

if [ -d "$INSTALL_DIR" ]; then
    echo "Updating existing installation in $INSTALL_DIR; preserving data and configuration."
fi
mkdir -p "$INSTALL_DIR"

echo "Downloading and extracting..."
curl -L "$DOWNLOAD_URL" | tar -xz -C "$INSTALL_DIR" --strip-components=1

echo "Configuring Docker image version in env..."
touch "$INSTALL_DIR/.env"
sed -i '/^IMAGE_TAG=/d' "$INSTALL_DIR/.env"
if [ -n "$RELEASE_TAG" ] && [ "$RELEASE_TAG" != "null" ]; then
    echo "IMAGE_TAG=$RELEASE_TAG" >> "$INSTALL_DIR/.env"
    echo "Pinned Docker image to: $RELEASE_TAG"
else
    echo "IMAGE_TAG=latest" >> "$INSTALL_DIR/.env"
    echo "Pinned Docker image to: latest"
fi

echo "Running setup script..."
cd "$INSTALL_DIR"
chmod +x setup/setup.sh
./setup/setup.sh

echo ""
echo "Install completed."
echo "The project is installed in: $INSTALL_DIR"
echo "After reboot, open http://<pi-ip> and create your admin login."
echo "run \"sudo reboot\" to start the kiosk browser."
