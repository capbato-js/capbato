#!/bin/bash

# Wrapper script for test database management
# Usage: ./test-db.sh [start|stop|restart|logs|status]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DB_SCRIPT="$SCRIPT_DIR/scripts/start-test-db.sh"

if [[ ! -f "$DB_SCRIPT" ]]; then
    echo "Error: Database script not found at $DB_SCRIPT"
    exit 1
fi

exec "$DB_SCRIPT" "$@"
