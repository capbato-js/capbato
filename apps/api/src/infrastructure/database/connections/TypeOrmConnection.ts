import { DataSource } from 'typeorm';
import { TodoEntity } from '../../todo/persistence/typeorm/TodoEntity';
import { UserEntity } from '../../user/persistence/typeorm/UserEntity';
import { PatientEntity } from '../../patient/persistence/typeorm/PatientEntity';
import { DoctorEntity } from '../../doctor/persistence/typeorm/DoctorEntity';
import { ScheduleEntity } from '../../schedule/persistence/typeorm/ScheduleEntity';
import { AppointmentEntity } from '../../appointment/persistence/typeorm/AppointmentEntity';
import { LabRequestEntity } from '../../laboratory/persistence/typeorm/LabRequestEntity';
import { BloodChemistryEntity } from '../../laboratory/persistence/typeorm/BloodChemistryEntity';
import { getDatabaseConfig, isDevelopment, isProduction } from '../../../config';

/**
 * ⚠️ DEVELOPMENT WARNING: Auto-migration in production is DANGEROUS!
 * This configuration temporarily allows database schema synchronization
 * in production for development purposes only.
 * NEVER use this in a real production environment!
 */

/**
 * Shared TypeORM DataSource configuration
 * Supports multiple database types and features
 */
export const createTypeOrmDataSource = (): DataSource => {
  const dbConfig = getDatabaseConfig();
  
  // Check for dangerous production auto-migration setting
  const allowProductionAutoMigration = process.env.ALLOW_PRODUCTION_AUTO_MIGRATION === 'true';
  const shouldSynchronize = isDevelopment() || allowProductionAutoMigration;
  
  // Show warnings for production auto-migration
  if (isProduction() && allowProductionAutoMigration) {
    console.warn('🚨 DANGER: Auto-migration enabled in PRODUCTION environment!');
    console.warn('🚨 This is a DEVELOPMENT-ONLY feature and should NEVER be used in real production!');
    console.warn('🚨 Database schema will be automatically synchronized on startup!');
    console.warn('🚨 This can cause DATA LOSS in production databases!');
    console.warn('🚨 Set ALLOW_PRODUCTION_AUTO_MIGRATION=false to disable this dangerous feature!');
    console.warn('🚨 Use proper database migrations instead!');
  }
  
  // Base configuration
  const baseConfig = {
    entities: [TodoEntity, UserEntity, PatientEntity, DoctorEntity, ScheduleEntity, AppointmentEntity, LabRequestEntity, BloodChemistryEntity],
    synchronize: shouldSynchronize,
    logging: isDevelopment() || (isProduction() && allowProductionAutoMigration), // Extra logging for production debug
  };

  // Database-specific configuration
  const dbType = dbConfig.type || 'sqlite';

  switch (dbType) {
    case 'postgresql':
      return new DataSource({
        type: 'postgres',
        url: dbConfig.url,
        host: dbConfig.host || 'localhost',
        port: dbConfig.port || 5432,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database || 'task_app',
        ...baseConfig,
      });

    case 'mysql':
      return new DataSource({
        type: 'mysql',
        url: dbConfig.url,
        host: dbConfig.host || 'localhost',
        port: dbConfig.port || 3306,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database || 'task_app',
        ...baseConfig,
      });

    case 'sqlite':
    default:
      return new DataSource({
        type: 'sqlite',
        database: dbConfig.url || './data/todos.db',
        ...baseConfig,
      });
  }
};

// Singleton instance
let dataSource: DataSource | null = null;

export const getTypeOrmDataSource = async (): Promise<DataSource> => {
  if (!dataSource) {
    dataSource = createTypeOrmDataSource();

    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log('📦 Shared TypeORM DataSource initialized');
    }
  }

  return dataSource;
};

export const closeTypeOrmConnection = async (): Promise<void> => {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
    dataSource = null;
    console.log('📦 Shared TypeORM DataSource closed');
  }
};