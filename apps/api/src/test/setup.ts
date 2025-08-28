import 'reflect-metadata';
import { vi } from 'vitest';

// Mock TypeORM decorators and functionality globally
vi.mock('typeorm', async () => {
  const actual = await vi.importActual('typeorm');
  return {
    ...actual,
    Entity: () => (target: any) => target,
    PrimaryColumn: () => (target: any, propertyKey: string) => {},
    Column: () => (target: any, propertyKey: string) => {},
    CreateDateColumn: () => (target: any, propertyKey: string) => {},
    UpdateDateColumn: () => (target: any, propertyKey: string) => {},
    DataSource: vi.fn().mockImplementation(() => ({
      initialize: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn().mkResolvedValue(undefined),
      isInitialized: false,
      manager: {
        findOne: vi.fn(),
        find: vi.fn(),
        save: vi.fn(),
        remove: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      }
    }))
  };
});

// Mock Morgan logger to prevent uncaught exceptions
vi.mock('morgan', () => ({
  default: vi.fn(() => (req: any, res: any, next: any) => next()),
}));
