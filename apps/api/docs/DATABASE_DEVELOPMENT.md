# Database Development Configuration

## ⚠️ CRITICAL WARNING: Auto-Migration in Production

This document describes a **DANGEROUS DEVELOPMENT FEATURE** that allows automatic database schema synchronization in production environments.

### 🚨 IMPORTANT NOTICE

**NEVER USE AUTO-MIGRATION IN REAL PRODUCTION ENVIRONMENTS!**

This feature is temporarily enabled for development purposes only and can cause **IRREVERSIBLE DATA LOSS** in production databases.

### Development Auto-Migration Feature

For development convenience, this application supports automatic database schema synchronization through the `ALLOW_PRODUCTION_AUTO_MIGRATION` environment variable.

#### How it works:

1. **Development Mode (Default)**: Auto-migration is always enabled
2. **Production Mode**: Auto-migration is disabled by default
3. **Production Mode with Override**: Set `ALLOW_PRODUCTION_AUTO_MIGRATION=true` to enable (NOT RECOMMENDED)

#### Environment Variable Configuration:

```bash
# Safe production setting (default)
ALLOW_PRODUCTION_AUTO_MIGRATION=false

# DANGEROUS: Enable auto-migration in production (DEVELOPMENT ONLY!)
ALLOW_PRODUCTION_AUTO_MIGRATION=true
```

### What happens when enabled in production:

1. **Multiple Warning Messages**: The application will display prominent warnings
2. **10-Second Delay**: Gives you time to abort the application (Ctrl+C)
3. **Automatic Schema Sync**: TypeORM will automatically synchronize the database schema
4. **Extra Logging**: Enhanced logging is enabled for debugging

### Proper Production Database Management:

Instead of using auto-migration in production, use proper migration workflows:

#### 1. Generate Migration Files:
```bash
npm run typeorm:migration:generate -- --name CreateInitialTables
```

#### 2. Review Generated Migrations:
```bash
# Check the generated migration files in src/migrations/
```

#### 3. Run Migrations in Production:
```bash
npm run typeorm:migration:run
```

#### 4. Rollback if Needed:
```bash
npm run typeorm:migration:revert
```

### When to use ALLOW_PRODUCTION_AUTO_MIGRATION=true:

- ✅ Local development environments
- ✅ CI/CD testing pipelines
- ✅ Staging environments with test data
- ✅ Docker development containers
- ❌ **NEVER in real production with live data**

### Startup Warning Example:

When `ALLOW_PRODUCTION_AUTO_MIGRATION=true` is set in production, you'll see:

```
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
🚨                    ⚠️  CRITICAL WARNING ⚠️                           🚨
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
🚨
🚨  AUTO-MIGRATION IS ENABLED IN PRODUCTION ENVIRONMENT!
🚨
🚨  ⚠️  This is EXTREMELY DANGEROUS and should NEVER be used in real production!
🚨  ⚠️  Database schema will be automatically synchronized on startup!
🚨  ⚠️  This can cause IRREVERSIBLE DATA LOSS!
🚨  ⚠️  This feature is intended for DEVELOPMENT PURPOSES ONLY!
🚨
🚨  📝 To disable this dangerous feature:
🚨     Set ALLOW_PRODUCTION_AUTO_MIGRATION=false in your environment
🚨     Or remove the environment variable entirely
🚨
🚨  📚 For production databases, use proper migration scripts instead
🚨
🚨  ⏰ This application will continue in 10 seconds...
🚨     Press Ctrl+C to abort and fix the configuration!
🚨
🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨
```

### Quick Disable Instructions:

If you accidentally enabled this in production:

1. **Immediate**: Press `Ctrl+C` during the 10-second warning period
2. **Environment**: Set `ALLOW_PRODUCTION_AUTO_MIGRATION=false`
3. **Remove**: Delete the environment variable entirely
4. **Restart**: Restart the application safely

---

**Remember**: This feature exists only for development convenience. Always use proper database migrations in production environments!
