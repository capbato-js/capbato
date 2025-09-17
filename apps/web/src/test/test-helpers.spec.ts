import { describe, it, expect } from 'vitest';
import { 
  TEST_UUIDS, 
  generateTestUuid, 
  createTestTodo, 
  createTestTodos 
} from './test-helpers';

describe('Test Helpers', () => {
  describe('TEST_UUIDS', () => {
    it('should provide consistent test UUIDs', () => {
      expect(TEST_UUIDS.TODO_1).toBe('123456789abcdef0123456789abcdef1');
      expect(TEST_UUIDS.TODO_2).toBe('123456789abcdef0123456789abcdef2');
      expect(TEST_UUIDS.TODO_3).toBe('123456789abcdef0123456789abcdef3');
      expect(TEST_UUIDS.TODO_4).toBe('123456789abcdef0123456789abcdef4');
      expect(TEST_UUIDS.TODO_5).toBe('123456789abcdef0123456789abcdef5');
    });

    it('should have all UUIDs be 32 characters long', () => {
      Object.values(TEST_UUIDS).forEach(uuid => {
        expect(uuid).toHaveLength(32);
        expect(uuid).toMatch(/^[0-9a-f]{32}$/);
      });
    });

    it('should have unique UUIDs', () => {
      const uuids = Object.values(TEST_UUIDS);
      const uniqueUuids = new Set(uuids);
      expect(uniqueUuids.size).toBe(uuids.length);
    });
  });

  describe('generateTestUuid', () => {
    it('should generate UUID with correct suffix', () => {
      expect(generateTestUuid(1)).toBe('123456789abcdef0123456789abcdef1');
      expect(generateTestUuid(2)).toBe('123456789abcdef0123456789abcdef2');
      expect(generateTestUuid(15)).toBe('123456789abcdef0123456789abcdeff');
    });

    it('should handle different suffix values', () => {
      expect(generateTestUuid(0)).toBe('123456789abcdef0123456789abcdef0');
      expect(generateTestUuid(10)).toBe('123456789abcdef0123456789abcdefa');
      expect(generateTestUuid(15)).toBe('123456789abcdef0123456789abcdeff');
    });

    it('should generate valid hex format', () => {
      const uuid = generateTestUuid(5);
      expect(uuid).toHaveLength(32);
      expect(uuid).toMatch(/^[0-9a-f]{32}$/);
    });
  });

  describe('createTestTodo', () => {
    it('should create a todo with default values', () => {
      const todo = createTestTodo();
      
      expect(todo).toEqual({
        id: TEST_UUIDS.TODO_1,
        title: 'Test Todo',
        completed: false,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
        updatedAt: new Date('2024-01-01T00:00:00.000Z'),
      });
    });

    it('should allow overriding individual properties', () => {
      const todo = createTestTodo({
        title: 'Custom Title',
        completed: true,
      });
      
      expect(todo.title).toBe('Custom Title');
      expect(todo.completed).toBe(true);
      expect(todo.id).toBe(TEST_UUIDS.TODO_1); // Should keep default
    });

    it('should allow overriding all properties', () => {
      const customDate = new Date('2024-12-31T23:59:59.999Z');
      const todo = createTestTodo({
        id: 'custom-id',
        title: 'Custom Todo',
        completed: true,
        createdAt: customDate,
        updatedAt: customDate,
      });
      
      expect(todo).toEqual({
        id: 'custom-id',
        title: 'Custom Todo',
        completed: true,
        createdAt: customDate,
        updatedAt: customDate,
      });
    });

    it('should handle partial overrides', () => {
      const todo = createTestTodo({ id: 'new-id' });
      
      expect(todo.id).toBe('new-id');
      expect(todo.title).toBe('Test Todo'); // Should keep default
      expect(todo.completed).toBe(false); // Should keep default
    });
  });

  describe('createTestTodos', () => {
    it('should create correct number of todos', () => {
      const todos = createTestTodos(3);
      expect(todos).toHaveLength(3);
    });

    it('should create todos with incremental IDs and titles', () => {
      const todos = createTestTodos(3);
      
      expect(todos[0].id).toBe(generateTestUuid(1));
      expect(todos[0].title).toBe('Test Todo 1');
      
      expect(todos[1].id).toBe(generateTestUuid(2));
      expect(todos[1].title).toBe('Test Todo 2');
      
      expect(todos[2].id).toBe(generateTestUuid(3));
      expect(todos[2].title).toBe('Test Todo 3');
    });

    it('should create todos with consistent default values', () => {
      const todos = createTestTodos(2);
      
      todos.forEach(todo => {
        expect(todo.completed).toBe(false);
        expect(todo.createdAt).toEqual(new Date('2024-01-01T00:00:00.000Z'));
        expect(todo.updatedAt).toEqual(new Date('2024-01-01T00:00:00.000Z'));
      });
    });

    it('should handle edge cases', () => {
      expect(createTestTodos(0)).toEqual([]);
      expect(createTestTodos(1)).toHaveLength(1);
    });

    it('should create large numbers of todos', () => {
      const todos = createTestTodos(100);
      expect(todos).toHaveLength(100);
      
      // Verify unique IDs
      const ids = todos.map(todo => todo.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100);
      
      // Verify incremental titles
      expect(todos[99].title).toBe('Test Todo 100');
    });

    it('should have all todos be valid objects', () => {
      const todos = createTestTodos(5);
      
      todos.forEach((todo, index) => {
        expect(todo).toHaveProperty('id');
        expect(todo).toHaveProperty('title');
        expect(todo).toHaveProperty('completed');
        expect(todo).toHaveProperty('createdAt');
        expect(todo).toHaveProperty('updatedAt');
        
        expect(typeof todo.id).toBe('string');
        expect(typeof todo.title).toBe('string');
        expect(typeof todo.completed).toBe('boolean');
        expect(todo.createdAt).toBeInstanceOf(Date);
        expect(todo.updatedAt).toBeInstanceOf(Date);
        
        expect(todo.title).toBe(`Test Todo ${index + 1}`);
      });
    });
  });
});