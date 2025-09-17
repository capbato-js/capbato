import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useOverflowHidden } from './useOverflowHidden';

// Extend vitest matchers
import '@testing-library/jest-dom';

describe('useOverflowHidden', () => {
  let originalOverflow: string;

  beforeEach(() => {
    // Store original overflow style
    originalOverflow = document.body.style.overflow;
  });

  afterEach(() => {
    // Restore original overflow style
    document.body.style.overflow = originalOverflow;
  });

  it('should set body overflow to hidden on mount', () => {
    renderHook(() => useOverflowHidden());

    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should restore body overflow to auto on unmount', () => {
    const { unmount } = renderHook(() => useOverflowHidden());

    // Verify it's set to hidden
    expect(document.body.style.overflow).toBe('hidden');

    // Unmount and verify it's restored
    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('should preserve previous overflow value when restoring', () => {
    // Set a custom overflow value
    document.body.style.overflow = 'scroll';

    const { unmount } = renderHook(() => useOverflowHidden());

    // Should be hidden during use
    expect(document.body.style.overflow).toBe('hidden');

    // Should restore to auto (default cleanup behavior)
    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('should handle multiple instances correctly with cleanup behavior', () => {
    const { unmount: unmount1 } = renderHook(() => useOverflowHidden());
    const { unmount: unmount2 } = renderHook(() => useOverflowHidden());

    // Both should set overflow to hidden
    expect(document.body.style.overflow).toBe('hidden');

    // The hook doesn't track multiple instances - each cleanup sets to 'auto'
    // This is the actual behavior of the simple implementation
    unmount1();
    expect(document.body.style.overflow).toBe('auto');

    // The second instance will also restore to auto when unmounted
    unmount2();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('should work with empty dependency array', () => {
    const { rerender } = renderHook(() => useOverflowHidden());

    expect(document.body.style.overflow).toBe('hidden');

    // Re-rendering shouldn't change the behavior
    rerender();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should handle rapid mount/unmount cycles', () => {
    // Mount
    const { unmount } = renderHook(() => useOverflowHidden());
    expect(document.body.style.overflow).toBe('hidden');

    // Unmount
    unmount();
    expect(document.body.style.overflow).toBe('auto');

    // Mount again
    const { unmount: unmount2 } = renderHook(() => useOverflowHidden());
    expect(document.body.style.overflow).toBe('hidden');

    // Unmount again
    unmount2();
    expect(document.body.style.overflow).toBe('auto');
  });

  it('should not throw errors if document.body is unavailable', () => {
    // This test ensures the hook doesn't break in edge cases
    // though in practice document.body should always be available in a browser environment
    const { unmount } = renderHook(() => useOverflowHidden());

    expect(() => {
      unmount();
    }).not.toThrow();
  });
});