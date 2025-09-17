import { describe, it, expect } from 'vitest';
import { ITodoApiService } from './ITodoApiService';

describe('ITodoApiService', () => {
  describe('interface contract', () => {
    it('should define all required methods with correct signatures', () => {
      const mockService: ITodoApiService = {
        getAllTodos: async () => ({ success: true, data: [] }),
        createTodo: async (todoData: any) => ({ success: true, data: {} as any }),
        updateTodo: async (id: string, updateData: any) => undefined,
        deleteTodo: async (id: string) => undefined,
        getTodoById: async (id: string) => ({ success: true, data: {} as any }),
        getActiveTodos: async () => ({ success: true, data: [] }),
        getCompletedTodos: async () => ({ success: true, data: [] })
      };

      const methods = ['getAllTodos', 'createTodo', 'updateTodo', 'deleteTodo', 'getTodoById', 'getActiveTodos', 'getCompletedTodos'];
      methods.forEach(method => {
        expect(mockService[method as keyof ITodoApiService]).toBeDefined();
        expect(typeof mockService[method as keyof ITodoApiService]).toBe('function');
      });
    });

    it('should ensure all methods return Promises', async () => {
      const mockService: ITodoApiService = {
        getAllTodos: async () => ({ success: true, data: [] }),
        createTodo: async () => ({ success: true, data: {} as any }),
        updateTodo: async () => undefined,
        deleteTodo: async () => undefined,
        getTodoById: async () => ({ success: true, data: {} as any }),
        getActiveTodos: async () => ({ success: true, data: [] }),
        getCompletedTodos: async () => ({ success: true, data: [] })
      };

      const results = await Promise.all([
        mockService.getAllTodos(),
        mockService.createTodo({}),
        mockService.updateTodo('id', {}),
        mockService.deleteTodo('id'),
        mockService.getTodoById('id'),
        mockService.getActiveTodos(),
        mockService.getCompletedTodos()
      ]);

      expect(results).toHaveLength(7);
    });
  });
});