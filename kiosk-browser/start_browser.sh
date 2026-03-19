#!/bin/bash

set -euo pipefail

DEFAULT_URL_FILE="$(cd "$(dirname "$0")" && pwd)/../settings/default_url.txt"
START_URL=""
if [ -f "$DEFAULT_URL_FILE" ]; then
  # Read first line
  START_URL="$(head -n 1 "$DEFAULT_URL_FILE" | tr -d '\r' | xargs)"
fi

# if START_URL is empty, set to default
if [ -z "$START_URL" ]; then
  START_URL="http://localhost/show-ip"
fi

# If START_URL is localhost, wait for it to be accessible (any response is fine)
if [[ "$START_URL" == http://localhost* ]]; then
  echo "Waiting for localhost to respond..."
  until curl -s --head --request GET http://localhost > /dev/null; do
    sleep 1
  done
  echo "Localhost is responding."
fi

CHROMIUM_CMD="chromium \
  --ozone-platform=wayland \
  --enable-features=UseOzonePlatform \
  --kiosk \
  --no-sandbox \
  --remote-debugging-port=9222 \
  --remote-allow-origins=* \
  --no-first-run \
  --noerrdialogs \
  --disable-infobars"

# Hide cursor by moving it off-screen, retry indefinitely until it succeeds.
(
  while true; do
    if wlrctl pointer move 99999 99999 2>/dev/null; then
      exit 0
    fi
    sleep 0.25
  done
) &
exec labwc -s "$CHROMIUM_CMD $START_URL"
