#!/bin/bash

# Clinic Management System - Test Database Startup Script
# This script starts a MySQL test database using Podman

set -e  # Exit on any error

# Configuration
CONTAINER_NAME="clinic-test-db"
MYSQL_ROOT_PASSWORD="testpassword"
DATABASE_NAME="clinic_management_system"
HOST_PORT="3307"
CONTAINER_PORT="3306"
MYSQL_IMAGE="mysql:8.0"

# Paths
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
SQL_DIR="$PROJECT_ROOT/server/sql"
BACKUP_FILE="$SQL_DIR/clinic_management_system_migrated_20250701_004337.sql"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_podman() {
    if ! command -v podman &> /dev/null; then
        log_error "Podman is not installed or not in PATH"
        log_info "Please install podman: https://podman.io/getting-started/installation"
        exit 1
    fi
    log_info "Podman is available"
}

check_backup_file() {
    if [[ ! -f "$BACKUP_FILE" ]]; then
        log_warning "Backup file not found: $BACKUP_FILE"
        log_info "Available backup files:"
        ls -la "$SQL_DIR"/*.sql 2>/dev/null || log_warning "No SQL files found in $SQL_DIR"
        
        # Try to find the most recent backup
        BACKUP_FILE="$SQL_DIR/full_backup.sql"
        if [[ -f "$BACKUP_FILE" ]]; then
            log_info "Using fallback backup: $BACKUP_FILE"
        else
            log_error "No suitable backup file found"
            exit 1
        fi
    fi
    log_info "Using backup file: $BACKUP_FILE"
}

stop_existing_container() {
    if podman ps -a --format "table {{.Names}}" | grep -q "^$CONTAINER_NAME$"; then
        log_info "Stopping and removing existing container: $CONTAINER_NAME"
        podman stop "$CONTAINER_NAME" 2>/dev/null || true
        podman rm "$CONTAINER_NAME" 2>/dev/null || true
        log_success "Existing container removed"
    fi
}

start_container() {
    log_info "Starting MySQL container: $CONTAINER_NAME"
    log_info "Configuration:"
    log_info "  - Image: $MYSQL_IMAGE"
    log_info "  - Port mapping: $HOST_PORT:$CONTAINER_PORT"
    log_info "  - Database: $DATABASE_NAME"
    log_info "  - Root password: $MYSQL_ROOT_PASSWORD"
    
    podman run --name "$CONTAINER_NAME" \
        -e MYSQL_ROOT_PASSWORD="$MYSQL_ROOT_PASSWORD" \
        -e MYSQL_DATABASE="$DATABASE_NAME" \
        -p "$HOST_PORT:$CONTAINER_PORT" \
        -d "$MYSQL_IMAGE"
    
    log_success "Container started successfully"
}

wait_for_mysql() {
    log_info "Waiting for MySQL to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if podman exec "$CONTAINER_NAME" mysqladmin ping -u root -p"$MYSQL_ROOT_PASSWORD" --silent 2>/dev/null; then
            log_success "MySQL is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 2
        ((attempt++))
    done
    
    log_error "MySQL failed to start within $(($max_attempts * 2)) seconds"
    return 1
}

import_backup() {
    log_info "Importing database backup..."
    log_info "Backup file: $BACKUP_FILE"
    
    # Wait a bit more to ensure MySQL is fully ready
    sleep 3
    
    if podman exec -i "$CONTAINER_NAME" mysql -u root -p"$MYSQL_ROOT_PASSWORD" "$DATABASE_NAME" < "$BACKUP_FILE"; then
        log_success "Database backup imported successfully"
    else
        log_error "Failed to import database backup"
        log_info "Container logs (last 10 lines):"
        podman logs "$CONTAINER_NAME" --tail 10 2>/dev/null || log_warning "Could not retrieve logs"
        return 1
    fi
}

verify_database() {
    log_info "Verifying database setup..."
    
    # Check if tables exist
    local table_count=$(podman exec "$CONTAINER_NAME" mysql -u root -p"$MYSQL_ROOT_PASSWORD" -D "$DATABASE_NAME" -e "SHOW TABLES;" --silent | wc -l)
    
    if [ "$table_count" -gt 0 ]; then
        log_success "Database contains $table_count tables"
        log_info "Sample tables:"
        podman exec "$CONTAINER_NAME" mysql -u root -p"$MYSQL_ROOT_PASSWORD" -D "$DATABASE_NAME" -e "SHOW TABLES;" | head -5
    else
        log_warning "Database appears to be empty"
    fi
}

show_connection_info() {
    log_success "Test database is ready!"
    echo
    log_info "Connection Details:"
    echo "  Host: localhost"
    echo "  Port: $HOST_PORT"
    echo "  Database: $DATABASE_NAME"
    echo "  Username: root"
    echo "  Password: $MYSQL_ROOT_PASSWORD"
    echo
    log_info "To connect manually:"
    echo "  mysql -h localhost -P $HOST_PORT -u root -p'$MYSQL_ROOT_PASSWORD' $DATABASE_NAME"
    echo
    log_info "To stop the container:"
    echo "  podman stop $CONTAINER_NAME"
    echo
    log_info "To view container logs:"
    echo "  podman logs $CONTAINER_NAME"
}

# Main execution
main() {
    log_info "Starting Clinic Management System Test Database..."
    echo
    
    check_podman
    check_backup_file
    stop_existing_container
    start_container
    wait_for_mysql
    import_backup
    verify_database
    show_connection_info
    
    log_success "Test database setup complete!"
}

# Handle script arguments
case "${1:-}" in
    "stop")
        log_info "Stopping test database container..."
        podman stop "$CONTAINER_NAME" 2>/dev/null || log_warning "Container not running"
        podman rm "$CONTAINER_NAME" 2>/dev/null || log_warning "Container not found"
        log_success "Test database stopped and removed"
        ;;
    "restart")
        log_info "Restarting test database..."
        "$0" stop
        "$0"
        ;;
    "logs")
        log_info "Showing container logs..."
        podman logs "$CONTAINER_NAME" --tail 50 -f 2>/dev/null || log_error "Could not retrieve logs"
        ;;
    "status")
        log_info "Container status:"
        podman ps -a --filter "name=$CONTAINER_NAME"
        ;;
    *)
        main
        ;;
esac
