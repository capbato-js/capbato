import Database from 'better-sqlite3';
import { getDatabaseConfig } from '../../../config';

/**
 * Shared SQLite database connection management
 * Provides singleton database instance for all features
 */
class SqliteConnectionManager {
  private static instance: SqliteConnectionManager;
  private db: Database.Database | null = null;

  private constructor() {}

  public static getInstance(): SqliteConnectionManager {
    if (!SqliteConnectionManager.instance) {
      SqliteConnectionManager.instance = new SqliteConnectionManager();
    }
    return SqliteConnectionManager.instance;
  }

  public getDatabase(): Database.Database {
    if (!this.db) {
      // Use database URL from config or default to memory for development
      const dbConfig = getDatabaseConfig();
      const dbPath = dbConfig.url || ':memory:';
      this.db = new Database(dbPath);
      console.log(`📦 Shared SQLite database connected: ${dbPath === ':memory:' ? 'in-memory' : dbPath}`);
      
      // Initialize all table schemas
      this.initializeTables();
    }
    return this.db;
  }

  private initializeTables(): void {
    if (!this.db) return;

    // Initialize todos table (existing functionality)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        priority TEXT NOT NULL DEFAULT 'medium',
        createdAt TEXT NOT NULL,
        dueDate TEXT
      )
    `);

    // Initialize users table (for auth functionality)
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        hashedPassword TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'receptionist',
        createdAt TEXT NOT NULL
      )
    `);

    // Migration: Add role column to existing users table if it doesn't exist
    try {
      this.db.exec(`
        ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'receptionist'
      `);
      console.log('🔄 Added role column to existing users table');
    } catch (error) {
      // Column already exists or other error - this is expected for new tables
      // console.log('Role column already exists or table is new');
    }

    // Initialize prescriptions table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id TEXT PRIMARY KEY,
        patientId TEXT NOT NULL,
        doctorId TEXT NOT NULL,
        medicationName TEXT NOT NULL,
        dosage TEXT NOT NULL,
        instructions TEXT NOT NULL,
        prescribedDate TEXT NOT NULL,
        expiryDate TEXT,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL
      )
    `);

    // Create indexes for better query performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON prescriptions (patientId);
      CREATE INDEX IF NOT EXISTS idx_prescriptions_doctor ON prescriptions (doctorId);
      CREATE INDEX IF NOT EXISTS idx_prescriptions_medication ON prescriptions (medicationName);
      CREATE INDEX IF NOT EXISTS idx_prescriptions_active ON prescriptions (isActive);
      CREATE INDEX IF NOT EXISTS idx_prescriptions_expiry ON prescriptions (expiryDate, isActive);
    `);

    console.log('📦 SQLite tables initialized');
  }

  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('📦 Shared SQLite database connection closed');
    }
  }
}

// Export singleton instance getter
export const getSqliteDatabase = (): Database.Database => {
  return SqliteConnectionManager.getInstance().getDatabase();
};

export const closeSqliteConnection = (): void => {
  SqliteConnectionManager.getInstance().close();
};