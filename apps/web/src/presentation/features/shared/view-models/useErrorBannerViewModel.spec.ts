import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useErrorBannerViewModel } from './useErrorBannerViewModel';

// Mock the TodoStore
const mockTodoStore = {
  error: null,
  clearError: vi.fn(),
  loadTodos: vi.fn(),
};

vi.mock('../../../../infrastructure/state/TodoStore', () => ({
  useTodoStore: () => mockTodoStore,
}));

describe('useErrorBannerViewModel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTodoStore.error = null;
  });

  it('should return hasError as false when there is no error', () => {
    mockTodoStore.error = null;
    
    const { result } = renderHook(() => useErrorBannerViewModel());
    
    expect(result.current.hasError).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return hasError as true when there is an error', () => {
    mockTodoStore.error = 'Test error message';
    
    const { result } = renderHook(() => useErrorBannerViewModel());
    
    expect(result.current.hasError).toBe(true);
    expect(result.current.error).toBe('Test error message');
  });

  it('should call clearError when dismiss is called', () => {
    const { result } = renderHook(() => useErrorBannerViewModel());
    
    act(() => {
      result.current.dismiss();
    });
    
    expect(mockTodoStore.clearError).toHaveBeenCalledTimes(1);
  });

  it('should call loadTodos when retry is called', () => {
    const { result } = renderHook(() => useErrorBannerViewModel());
    
    act(() => {
      result.current.retry();
    });
    
    expect(mockTodoStore.loadTodos).toHaveBeenCalledTimes(1);
  });

  it('should handle empty string error', () => {
    mockTodoStore.error = '';
    
    const { result } = renderHook(() => useErrorBannerViewModel());
    
    expect(result.current.hasError).toBe(false);
    expect(result.current.error).toBe('');
  });

  it('should handle undefined error', () => {
    mockTodoStore.error = undefined;
    
    const { result } = renderHook(() => useErrorBannerViewModel());
    
    expect(result.current.hasError).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should memoize dismiss and retry functions', () => {
    const { result, rerender } = renderHook(() => useErrorBannerViewModel());
    
    const firstRender = {
      dismiss: result.current.dismiss,
      retry: result.current.retry,
    };
    
    rerender();
    
    const secondRender = {
      dismiss: result.current.dismiss,
      retry: result.current.retry,
    };
    
    expect(firstRender.dismiss).toBe(secondRender.dismiss);
    expect(firstRender.retry).toBe(secondRender.retry);
  });

  it('should handle different error types', () => {
    // String error
    mockTodoStore.error = 'String error';
    const { result: stringResult } = renderHook(() => useErrorBannerViewModel());
    expect(stringResult.current.hasError).toBe(true);
    expect(stringResult.current.error).toBe('String error');

    // Boolean false
    mockTodoStore.error = false;
    const { result: booleanResult } = renderHook(() => useErrorBannerViewModel());
    expect(booleanResult.current.hasError).toBe(false);
    expect(booleanResult.current.error).toBe(false);

    // Number 0
    mockTodoStore.error = 0;
    const { result: numberResult } = renderHook(() => useErrorBannerViewModel());
    expect(numberResult.current.hasError).toBe(false);
    expect(numberResult.current.error).toBe(0);
  });

  it('should maintain function identity across re-renders with same dependencies', () => {
    const { result, rerender } = renderHook(() => useErrorBannerViewModel());
    
    const initialDismiss = result.current.dismiss;
    const initialRetry = result.current.retry;
    
    // Re-render without changing dependencies
    rerender();
    
    expect(result.current.dismiss).toBe(initialDismiss);
    expect(result.current.retry).toBe(initialRetry);
  });
});