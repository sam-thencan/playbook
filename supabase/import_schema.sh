#!/usr/bin/env bash
set -euo pipefail

# Helper to apply supabase/schema.sql to a Postgres database.
# Usage:
#   DATABASE_URL='postgres://user:pass@host:5432/db' ./supabase/import_schema.sh
# Or if supabase local is running:
#   ./supabase/import_schema.sh local

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SCHEMA_FILE="$ROOT_DIR/supabase/schema.sql"

if [[ "${1:-}" == "local" ]]; then
  if ! command -v supabase >/dev/null 2>&1; then
    echo "Supabase CLI not found. Install from https://supabase.com/docs/guides/cli" >&2
    exit 1
  fi
  supabase db reset --db-url env:DATABASE_URL --debug --no-verify | cat
  exit 0
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "DATABASE_URL is required (e.g., postgres://user:pass@host:5432/db)" >&2
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "psql not found. Install PostgreSQL client tools." >&2
  exit 1
fi

psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$SCHEMA_FILE" | cat
echo "Applied $SCHEMA_FILE"


