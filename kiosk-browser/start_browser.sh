#!/bin/bash

set -euo pipefail

DATABASE_FILE="${KIOSK_DATABASE_FILE:-$(cd "$(dirname "$0")" && pwd)/../data/kiosk.db}"
START_URL=""
if [ -f "$DATABASE_FILE" ]; then
  # Read without creating a database; allow startup alongside the first migration.
  if ! START_URL="$(sqlite3 -readonly -cmd '.timeout 5000' "$DATABASE_FILE" 'SELECT url FROM KioskSettings WHERE id = 1;')"; then
    echo "Could not read the kiosk database; opening the default page." >&2
    START_URL=""
  fi
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
printf -v QUOTED_URL '%q' "$START_URL"
exec labwc -s "$CHROMIUM_CMD $QUOTED_URL"
