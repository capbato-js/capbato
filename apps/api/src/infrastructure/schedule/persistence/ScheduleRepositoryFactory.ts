import { injectable } from 'tsyringe';
import type { IScheduleRepository } from '@nx-starter/domain';
import { InMemoryScheduleRepository } from './in-memory/InMemoryScheduleRepository';
import { SqliteScheduleRepository } from './sqlite/SqliteScheduleRepository';
import { TypeOrmScheduleRepository } from './typeorm/TypeOrmScheduleRepository';
import { MongooseScheduleRepository } from './mongoose/MongooseScheduleRepository';
import { getConfig } from '../../../config';
import { createTypeOrmDataSource } from '../../database/connections/TypeOrmConnection';

/**
 * Factory for creating schedule repository instances
 * Supports multiple database implementations based on configuration
 */
@injectable()
export class ScheduleRepositoryFactory {
  static create(): IScheduleRepository {
    const config = getConfig();
    const dbType = config.database.type;

    switch (dbType.toLowerCase()) {
      case 'sqlite':
        return new SqliteScheduleRepository();
      
      case 'typeorm':
      case 'postgres':
      case 'postgresql':
      case 'mysql':
        const dataSource = createTypeOrmDataSource();
        return new TypeOrmScheduleRepository(dataSource);
      
      case 'mongodb':
      case 'mongoose':
        return new MongooseScheduleRepository();
      
      case 'memory':
      case 'in-memory':
      default:
        return new InMemoryScheduleRepository();
    }
  }
}