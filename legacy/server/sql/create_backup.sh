#!/bin/bash
# BACKUP SCRIPT - Export complete database with migrated Patient IDs
# This creates a backup that your friend can import on her PC

# Database credentials - modify as needed
DB_NAME="clinic_management_system"
DB_USER="root"
BACKUP_DATE=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="clinic_management_system_migrated_${BACKUP_DATE}.sql"

echo "🚀 Creating backup of migrated clinic management system..."
echo "📅 Date: $(date)"
echo "💾 Database: ${DB_NAME}"
echo "📁 Backup file: ${BACKUP_FILE}"
echo ""

# Create the backup
mysqldump -u ${DB_USER} -p \
  --single-transaction \
  --routines \
  --triggers \
  --complete-insert \
  --add-drop-database \
  --databases ${DB_NAME} > ${BACKUP_FILE}

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "✅ Backup created successfully!"
    echo "📁 File: ${BACKUP_FILE}"
    echo "📊 Size: $(ls -lh ${BACKUP_FILE} | awk '{print $5}')"
    echo ""
    echo "📋 INSTRUCTIONS FOR YOUR FRIEND:"
    echo "1. Copy ${BACKUP_FILE} to her PC"
    echo "2. Run: mysql -u root -p < ${BACKUP_FILE}"
    echo "3. All Patient IDs will be in 2025- format (e.g., 2025-A1, 2025-R4)"
    echo ""
    echo "✨ The database includes:"
    echo "   - All migrated patients with 2025- prefix"
    echo "   - All appointments properly linked"
    echo "   - All lab requests properly linked"
    echo "   - Updated schema (VARCHAR(15) for Patient IDs)"
else
    echo "❌ Backup failed!"
fi
