import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  mockNavigate,
  mockUseLocation,
  mockUseParams,
  mockUseSearchParams,
} from './react-router';

describe('React Router Mocks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('mockNavigate', () => {
    it('should be a mock function', () => {
      expect(vi.isMockFunction(mockNavigate)).toBe(true);
    });

    it('should be callable', () => {
      mockNavigate('/test-path');
      expect(mockNavigate).toHaveBeenCalledWith('/test-path');
    });
  });

  describe('mockUseLocation', () => {
    it('should return default location object', () => {
      const location = mockUseLocation();
      expect(location).toEqual({
        pathname: '/',
        search: '',
        hash: '',
        state: null,
        key: 'default',
      });
    });

    it('should be customizable', () => {
      mockUseLocation.mockReturnValue({
        pathname: '/custom',
        search: '?test=1',
        hash: '#section',
        state: { custom: true },
        key: 'custom-key',
      });

      const location = mockUseLocation();
      expect(location.pathname).toBe('/custom');
      expect(location.search).toBe('?test=1');
      expect(location.hash).toBe('#section');
      expect(location.state).toEqual({ custom: true });
      expect(location.key).toBe('custom-key');
    });
  });

  describe('mockUseParams', () => {
    it('should return empty object by default', () => {
      const params = mockUseParams();
      expect(params).toEqual({});
    });

    it('should be customizable', () => {
      mockUseParams.mockReturnValue({ id: '123', slug: 'test' });
      const params = mockUseParams();
      expect(params).toEqual({ id: '123', slug: 'test' });
    });
  });

  describe('mockUseSearchParams', () => {
    it('should return URLSearchParams and setter function', () => {
      const [searchParams, setSearchParams] = mockUseSearchParams();
      expect(searchParams).toBeInstanceOf(URLSearchParams);
      expect(vi.isMockFunction(setSearchParams)).toBe(true);
    });

    it('should be customizable', () => {
      const customSearchParams = new URLSearchParams('key=value');
      const customSetter = vi.fn();
      mockUseSearchParams.mockReturnValue([customSearchParams, customSetter]);

      const [searchParams, setSearchParams] = mockUseSearchParams();
      expect(searchParams.get('key')).toBe('value');
      expect(setSearchParams).toBe(customSetter);
    });
  });
});