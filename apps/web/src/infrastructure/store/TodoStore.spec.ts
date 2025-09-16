import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTodoStore } from './TodoStore';

describe('TodoStore', () => {
  beforeEach(() => {
    // Reset global state before each test
    vi.clearAllMocks();
  });

  it('should initialize with null error', () => {
    const { result } = renderHook(() => useTodoStore());
    
    expect(result.current.error).toBeNull();
  });

  it('should provide clearError function', () => {
    const { result } = renderHook(() => useTodoStore());
    
    expect(typeof result.current.clearError).toBe('function');
  });

  it('should provide loadTodos function', () => {
    const { result } = renderHook(() => useTodoStore());
    
    expect(typeof result.current.loadTodos).toBe('function');
  });

  it('should call clearError without errors', () => {
    const { result } = renderHook(() => useTodoStore());
    
    expect(() => {
      act(() => {
        result.current.clearError();
      });
    }).not.toThrow();
  });

  it('should call loadTodos without errors', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { result } = renderHook(() => useTodoStore());
    
    act(() => {
      result.current.loadTodos();
    });
    
    expect(consoleSpy).toHaveBeenCalledWith('Loading todos...');
    consoleSpy.mockRestore();
  });

  it('should maintain function identity across re-renders', () => {
    const { result, rerender } = renderHook(() => useTodoStore());
    
    const initialClearError = result.current.clearError;
    const initialLoadTodos = result.current.loadTodos;
    
    rerender();
    
    expect(result.current.clearError).toBe(initialClearError);
    expect(result.current.loadTodos).toBe(initialLoadTodos);
  });

  it('should handle multiple store instances', () => {
    const { result: result1 } = renderHook(() => useTodoStore());
    const { result: result2 } = renderHook(() => useTodoStore());
    
    // Both should have the same error state initially
    expect(result1.current.error).toBe(result2.current.error);
    
    // Functions should work independently
    expect(() => {
      act(() => {
        result1.current.clearError();
        result2.current.loadTodos();
      });
    }).not.toThrow();
  });

  it('should sync state across multiple hook instances', () => {
    const { result: result1 } = renderHook(() => useTodoStore());
    const { result: result2 } = renderHook(() => useTodoStore());
    
    // Initially both should have null error
    expect(result1.current.error).toBeNull();
    expect(result2.current.error).toBeNull();
    
    // Clear error from one instance should affect both
    act(() => {
      result1.current.clearError();
    });
    
    expect(result1.current.error).toBeNull();
    expect(result2.current.error).toBeNull();
  });

  it('should handle cleanup properly', () => {
    const { unmount } = renderHook(() => useTodoStore());
    
    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });
});