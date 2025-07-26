# Test Database Scripts

This directory contains scripts for managing the Clinic Management System test database.

## Quick Start

From the project root directory:

```bash
# Start the test database
./test-db.sh

# Stop the test database
./test-db.sh stop

# Restart the test database
./test-db.sh restart

# View container logs
./test-db.sh logs

# Check container status
./test-db.sh status
```

## What the Script Does

The `start-test-db.sh` script:

1. **Checks prerequisites** - Ensures Podman is installed
2. **Stops existing container** - Removes any previous test database container
3. **Starts MySQL container** - Creates a new MySQL 8.0 container with:
   - Name: `clinic-test-db`
   - Port mapping: `3307:3306` (host:container)
   - Root password: `testpassword`
   - Database: `clinic_management_system`
4. **Waits for MySQL** - Ensures the database is fully ready
5. **Imports backup** - Loads the latest database schema and data
6. **Verifies setup** - Confirms the database contains expected tables
7. **Shows connection info** - Displays connection details for manual access

## Database Configuration

The test database uses these connection settings (as configured in `server/.env`):

```env
CLINIC_DB_HOST=localhost
CLINIC_DB_PORT=3307
CLINIC_DB_USER=root
CLINIC_DB_PASSWORD=testpassword
CLINIC_DB_NAME=clinic_management_system
```

## Manual Database Access

You can connect to the test database manually using:

```bash
mysql -h localhost -P 3307 -u root -p'testpassword' clinic_management_system
```

Or using the container directly:

```bash
podman exec -it clinic-test-db mysql -u root -p'testpassword' clinic_management_system
```

## Troubleshooting

### Container Won't Start

- Check if Podman is installed: `podman --version`
- Check if port 3307 is available: `lsof -i :3307`
- View detailed logs: `./test-db.sh logs`

### Database Import Fails

- Ensure the backup file exists in `server/sql/`
- Check container logs for MySQL errors
- Verify the container is fully started before import

### Connection Issues

- Verify the container is running: `./test-db.sh status`
- Check your `.env` file has the correct port (3307)
- Ensure your application is using the port from environment variables

## Files

- `start-test-db.sh` - Main database management script
- `../test-db.sh` - Wrapper script for easier access from project root
- `../server/.env` - Database connection configuration
- `../server/sql/` - Database backup files
