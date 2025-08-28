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
    PrimaryGeneratedColumn: () => (target: any, propertyKey: string) => {},
    Index: () => (target: any, propertyKey: string) => {},
    ManyToOne: () => (target: any, propertyKey: string) => {},
    OneToMany: () => (target: any, propertyKey: string) => {},
    JoinColumn: () => (target: any, propertyKey: string) => {},
    DataSource: vi.fn().mockImplementation(() => ({
      initialize: vi.fn().mockResolvedValue(undefined),
      destroy: vi.fn().mockResolvedValue(undefined),
      isInitialized: false,
      getRepository: vi.fn().mockReturnValue({
        create: vi.fn(),
        save: vi.fn(),
        find: vi.fn().mockResolvedValue([]),
        findOne: vi.fn(),
        findOneBy: vi.fn(),
        findBy: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        remove: vi.fn(),
        count: vi.fn().mockResolvedValue(0),
        createQueryBuilder: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnThis(),
          orderBy: vi.fn().mockReturnThis(),
          getMany: vi.fn().mockResolvedValue([]),
          getOne: vi.fn().mockResolvedValue(null),
          getCount: vi.fn().mockResolvedValue(0),
        })
      }),
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
  format: vi.fn(),
}));

// Mock routing-controllers
vi.mock('routing-controllers', async () => {
  const actual = await vi.importActual('routing-controllers');
  return {
    ...actual,
    Get: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => descriptor,
    Post: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => descriptor,
    Put: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => descriptor,
    Delete: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => descriptor,
    Patch: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => descriptor,
    JsonController: () => (target: any) => target,
    Body: () => (target: any, propertyKey: string, parameterIndex: number) => {},
    Param: () => (target: any, propertyKey: string, parameterIndex: number) => {},
    QueryParam: () => (target: any, propertyKey: string, parameterIndex: number) => {},
  };
});
