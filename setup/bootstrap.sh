#!/bin/bash

# This script bootstraps the installation of the Raspberry Pi Chromium Kiosk.
# Usage: curl -sSL https://raw.githubusercontent.com/Daniel-Gia/raspberry-pi-chromium-kiosk/main/setup/bootstrap.sh | sudo bash

set -euo pipefail

REPO_OWNER="Daniel-Gia"
REPO_NAME="raspberry-pi-chromium-kiosk"
INSTALL_DIR="/raspberry-pi-chromium-kiosk"

USERNAME="${1:-}"
PASSWORD="${2:-}"

# Check if running as root
if [ "$(id -u)" -ne 0 ]; then
    echo "This script must be run as root. Please use sudo."
    exit 1
fi

echo "== Raspberry Pi Chromium Kiosk Bootstrap =="

# Install dependencies
echo "Installing dependencies..."
apt-get update
apt-get install -y curl tar

# Get the latest release URL
echo "Fetching latest release info..."
LATEST_RELEASE_DATA=$(curl -s "https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/releases/latest")
TARBALL_URL=$(echo "$LATEST_RELEASE_DATA" | grep '"tarball_url":' | sed -E 's/.*"([^"]+)".*/\1/')

if [ -z "$TARBALL_URL" ]; then
    echo "Warning: Could not find the latest release. Falling back to 'main' branch."
    TARBALL_URL="https://github.com/$REPO_OWNER/$REPO_NAME/archive/refs/heads/main.tar.gz"
fi

echo "Downloading from: $TARBALL_URL"

# Prepare install directory
if [ -d "$INSTALL_DIR" ]; then
    echo "Removing existing installation in $INSTALL_DIR..."
    rm -rf "$INSTALL_DIR"
fi
mkdir -p "$INSTALL_DIR"

# Download and extract
echo "Downloading and extracting..."
curl -L "$TARBALL_URL" | tar -xz -C "$INSTALL_DIR" --strip-components=1

# Run the main setup script
echo "Running setup script..."
cd "$INSTALL_DIR"
chmod +x setup/setup.sh
./setup/setup.sh

# Generate admin login
echo "Generating admin login..."
if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ]; then
    echo "No username/password provided. Using defaults."
    USERNAME="admin"
    PASSWORD="admin"
    echo "Default credentials -> Username: $USERNAME, Password: $PASSWORD"
else
    echo "Using provided credentials for admin panel."
fi

chmod +x setup/generate-admin-login.sh
./setup/generate-admin-login.sh "$USERNAME" "$PASSWORD"

echo ""
echo "Bootstrap complete."
echo "The project is installed in: $INSTALL_DIR"
echo "Admin panel credentials configured."
