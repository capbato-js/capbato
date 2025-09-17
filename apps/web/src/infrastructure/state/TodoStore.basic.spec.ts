import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodoStore } from './TodoStore';

// Extend vitest matchers
import '@testing-library/jest-dom';

// Mock the DI container
vi.mock('../di/container', () => ({
  container: {
    resolve: vi.fn(() => ({
      createTodo: vi.fn(),
      updateTodo: vi.fn(),
      deleteTodo: vi.fn(),
      toggleTodo: vi.fn(),
      getAllTodos: vi.fn(),
      getFilteredTodos: vi.fn(),
      getTodoStats: vi.fn(),
    })),
  },
  TOKENS: {
    TodoCommandService: 'TodoCommandService',
    TodoQueryService: 'TodoQueryService',
  },
}));

describe('TodoStore Basic Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useTodoStore());

      expect(result.current.todos).toEqual([]);
      expect(result.current.filter).toBe('all');
      expect(result.current.status).toBe('idle');
      expect(result.current.error).toBeNull();
    });
  });

  describe('Computed Values', () => {
    it('should filter todos correctly', () => {
      const { result } = renderHook(() => useTodoStore());

      const mockTodos = [
        { id: '1', title: 'Todo 1', completed: false, priority: 'medium', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'Todo 2', completed: true, priority: 'high', createdAt: new Date(), updatedAt: new Date() },
        { id: '3', title: 'Todo 3', completed: false, priority: 'low', createdAt: new Date(), updatedAt: new Date() },
      ];

      act(() => {
        result.current.todos = mockTodos;
        result.current.filter = 'all';
      });

      expect(result.current.getFilteredTodos()).toHaveLength(3);

      act(() => {
        result.current.filter = 'active';
      });

      const activeTodos = result.current.getFilteredTodos();
      expect(activeTodos).toHaveLength(2);
      expect(activeTodos.every(todo => !todo.completed)).toBe(true);

      act(() => {
        result.current.filter = 'completed';
      });

      const completedTodos = result.current.getFilteredTodos();
      expect(completedTodos).toHaveLength(1);
      expect(completedTodos.every(todo => todo.completed)).toBe(true);
    });

    it('should calculate stats correctly', () => {
      const { result } = renderHook(() => useTodoStore());

      const mockTodos = [
        { id: '1', title: 'Todo 1', completed: false, priority: 'medium', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'Todo 2', completed: true, priority: 'high', createdAt: new Date(), updatedAt: new Date() },
        { id: '3', title: 'Todo 3', completed: false, priority: 'low', createdAt: new Date(), updatedAt: new Date() },
      ];

      act(() => {
        result.current.todos = mockTodos;
      });

      const stats = result.current.getStats();
      expect(stats.total).toBe(3);
      expect(stats.active).toBe(2);
      expect(stats.completed).toBe(1);
    });

    it('should calculate stats correctly for empty state', () => {
      const { result } = renderHook(() => useTodoStore());

      // Reset to ensure clean state
      act(() => {
        result.current.todos = [];
      });

      const stats = result.current.getStats();
      expect(stats.total).toBe(0);
      expect(stats.active).toBe(0);
      expect(stats.completed).toBe(0);
    });
  });

  describe('Filter State', () => {
    it('should update filter state correctly', () => {
      const { result } = renderHook(() => useTodoStore());

      // Reset to ensure clean state
      act(() => {
        result.current.filter = 'all';
      });

      expect(result.current.filter).toBe('all');

      act(() => {
        result.current.filter = 'active';
      });

      expect(result.current.filter).toBe('active');

      act(() => {
        result.current.filter = 'completed';
      });

      expect(result.current.filter).toBe('completed');
    });
  });

  describe('Store Structure', () => {
    it('should have all required state properties', () => {
      const { result } = renderHook(() => useTodoStore());

      expect(result.current).toHaveProperty('todos');
      expect(result.current).toHaveProperty('filter');
      expect(result.current).toHaveProperty('status');
      expect(result.current).toHaveProperty('error');
    });

    it('should have all required computed functions', () => {
      const { result } = renderHook(() => useTodoStore());

      expect(typeof result.current.getFilteredTodos).toBe('function');
      expect(typeof result.current.getStats).toBe('function');
    });
  });

  describe('Edge Cases', () => {
    it('should handle todos with all completed', () => {
      const { result } = renderHook(() => useTodoStore());

      const allCompletedTodos = [
        { id: '1', title: 'Todo 1', completed: true, priority: 'medium', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'Todo 2', completed: true, priority: 'high', createdAt: new Date(), updatedAt: new Date() },
      ];

      act(() => {
        result.current.todos = allCompletedTodos;
        result.current.filter = 'active';
      });

      expect(result.current.getFilteredTodos()).toHaveLength(0);

      act(() => {
        result.current.filter = 'completed';
      });

      expect(result.current.getFilteredTodos()).toHaveLength(2);
    });

    it('should handle todos with all active', () => {
      const { result } = renderHook(() => useTodoStore());

      const allActiveTodos = [
        { id: '1', title: 'Todo 1', completed: false, priority: 'medium', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', title: 'Todo 2', completed: false, priority: 'high', createdAt: new Date(), updatedAt: new Date() },
      ];

      act(() => {
        result.current.todos = allActiveTodos;
        result.current.filter = 'completed';
      });

      expect(result.current.getFilteredTodos()).toHaveLength(0);

      act(() => {
        result.current.filter = 'active';
      });

      expect(result.current.getFilteredTodos()).toHaveLength(2);
    });

    it('should handle unknown filter values', () => {
      const { result } = renderHook(() => useTodoStore());

      const mockTodos = [
        { id: '1', title: 'Todo 1', completed: false, priority: 'medium', createdAt: new Date(), updatedAt: new Date() },
      ];

      act(() => {
        result.current.todos = mockTodos;
        result.current.filter = 'unknown' as any;
      });

      // Unknown filter should default to showing all todos
      expect(result.current.getFilteredTodos()).toHaveLength(1);
    });
  });
});