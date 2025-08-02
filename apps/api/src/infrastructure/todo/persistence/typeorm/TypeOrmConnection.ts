import { DataSource } from 'typeorm';
import { TodoEntity } from './TodoEntity';
import { UserEntity } from '../../../user/persistence/typeorm/UserEntity';
import { PatientEntity } from '../../../patient/persistence/typeorm/PatientEntity';
import { DoctorEntity } from '../../../doctor/persistence/typeorm/DoctorEntity';
import { ScheduleEntity } from '../../../schedule/persistence/typeorm/ScheduleEntity';
import { AppointmentEntity } from '../../../appointment/persistence/typeorm/AppointmentEntity';
import { getDatabaseConfig, getServerConfig } from '../../../../config';

/**
 * TypeORM DataSource configuration
 * Supports multiple database types
 */
export const createTypeOrmDataSource = (): DataSource => {
  const dbConfig = getDatabaseConfig();
  const serverConfig = getServerConfig();
  
  // Base configuration
  const baseConfig = {
    entities: [TodoEntity, UserEntity, PatientEntity, DoctorEntity, ScheduleEntity, AppointmentEntity],
    synchronize: serverConfig.environment === 'development',
    logging: serverConfig.environment === 'development',
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
      console.log('📦 TypeORM DataSource initialized');
    }
  }

  return dataSource;
};

export const closeTypeOrmConnection = async (): Promise<void> => {
  if (dataSource && dataSource.isInitialized) {
    await dataSource.destroy();
    dataSource = null;
    console.log('📦 TypeORM DataSource closed');
  }
};
