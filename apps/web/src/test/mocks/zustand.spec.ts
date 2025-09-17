import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockZustandStore, mockZustandCreate } from './zustand';

describe('Zustand Mocks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createMockZustandStore', () => {
    it('should create a store with initial state', () => {
      const initialState = { count: 0, name: 'test' };
      const store = createMockZustandStore(initialState);

      expect(store.getState()).toEqual(initialState);
    });

    it('should update state with partial object', () => {
      const initialState = { count: 0, name: 'test' };
      const store = createMockZustandStore(initialState);

      store.setState({ count: 5 });
      expect(store.getState()).toEqual({ count: 5, name: 'test' });
    });

    it('should update state with function', () => {
      const initialState = { count: 0, name: 'test' };
      const store = createMockZustandStore(initialState);

      store.setState((state) => ({ count: state.count + 1 }));
      expect(store.getState()).toEqual({ count: 1, name: 'test' });
    });

    it('should notify listeners when state changes', () => {
      const initialState = { count: 0 };
      const store = createMockZustandStore(initialState);
      const listener = vi.fn();

      const unsubscribe = store.subscribe(listener);
      store.setState({ count: 1 });

      expect(listener).toHaveBeenCalledTimes(1);
      unsubscribe();
    });

    it('should unsubscribe listeners', () => {
      const initialState = { count: 0 };
      const store = createMockZustandStore(initialState);
      const listener = vi.fn();

      const unsubscribe = store.subscribe(listener);
      unsubscribe();
      store.setState({ count: 1 });

      expect(listener).not.toHaveBeenCalled();
    });

    it('should handle multiple listeners', () => {
      const initialState = { count: 0 };
      const store = createMockZustandStore(initialState);
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      store.subscribe(listener1);
      store.subscribe(listener2);
      store.setState({ count: 1 });

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    it('should clear all listeners on destroy', () => {
      const initialState = { count: 0 };
      const store = createMockZustandStore(initialState);
      const listener = vi.fn();

      store.subscribe(listener);
      store.destroy();
      store.setState({ count: 1 });

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('mockZustandCreate', () => {
    it('should be a mock function', () => {
      expect(vi.isMockFunction(mockZustandCreate)).toBe(true);
    });

    it('should create a store using the create state function', () => {
      const createStateFn = vi.fn().mockReturnValue({ count: 0 });
      const store = mockZustandCreate(createStateFn);

      expect(createStateFn).toHaveBeenCalled();
      expect(store.getState()).toEqual({ count: 0 });
    });

    it('should pass set, get, and api functions to create state', () => {
      const createStateFn = vi.fn().mockReturnValue({ count: 0 });
      mockZustandCreate(createStateFn);

      expect(createStateFn).toHaveBeenCalledWith(
        expect.any(Function), // set
        expect.any(Function), // get
        expect.any(Function)  // api
      );
    });

    it('should return a functional store', () => {
      const createStateFn = () => ({ count: 0, increment: () => {} });
      const store = mockZustandCreate(createStateFn);

      expect(store.getState).toBeInstanceOf(Function);
      expect(store.setState).toBeInstanceOf(Function);
      expect(store.subscribe).toBeInstanceOf(Function);
      expect(store.destroy).toBeInstanceOf(Function);
    });
  });

  describe('store integration', () => {
    it('should work with complex state updates', () => {
      const createStateFn = (set: any, get: any) => ({
        todos: [],
        addTodo: (todo: string) => set((state: any) => ({ 
          todos: [...state.todos, { id: Date.now(), text: todo }] 
        })),
        getTodoCount: () => get().todos.length,
      });

      const store = mockZustandCreate(createStateFn);
      expect(store.getState().todos).toEqual([]);

      store.setState({ todos: [{ id: 1, text: 'Test todo' }] });
      expect(store.getState().todos).toHaveLength(1);
      expect(store.getState().todos[0].text).toBe('Test todo');
    });
  });
});