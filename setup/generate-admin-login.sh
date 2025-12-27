#!/usr/bin/env sh
set -eu

if [ "${1-}" = "" ] || [ "${2-}" = "" ]; then
  echo "Usage: $0 <username> <password>" >&2
  exit 2
fi

USERNAME="$1"
PASSWORD="$2"

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
PROJECT_DIR="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"
ENV_FILE="$PROJECT_DIR/.env"

if ! command -v openssl >/dev/null 2>&1; then
  echo "Error: missing 'openssl'. Install it and re-run." >&2
  exit 1
fi

NEXTAUTH_SECRET="$(openssl rand -hex 32)"

PASSWORD_HASH=""

if ! command -v htpasswd >/dev/null 2>&1; then
  echo "Error: missing 'htpasswd' (apache2-utils). Install it and re-run." >&2
  exit 1
fi

PASSWORD_HASH="$(htpasswd -bnBC 10 "" "$PASSWORD" | cut -d: -f2 | tr -d '\r\n')"

# $2b$10$Abc... -> $$2b$$10$$Abc... -> so that when Docker Compose reads it, it becomes $2b$10$Abc...
PASSWORD_HASH="$(printf '%s' "$PASSWORD_HASH" | sed 's/\$/\$\$/g')"

{
  echo "ADMIN_PANEL_USERNAME=$USERNAME"
  echo "ADMIN_PANEL_PASSWORD_HASH=$PASSWORD_HASH"
  echo "NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
} > "$ENV_FILE"

chmod 600 "$ENV_FILE" 2>/dev/null || true

echo "DONE!"
echo "- ADMIN_PANEL_USERNAME=$USERNAME"
echo "- ADMIN_PANEL_PASSWORD_HASH=<bcrypt>"
echo "- NEXTAUTH_SECRET=<generated>"
