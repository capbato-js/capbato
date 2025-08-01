import { getEnvironmentConfig } from './EnvironmentConfig';

describe('EnvironmentConfig', () => {
  const originalEnv = process.env;
  
  beforeEach(() => {
    // Clear environment variables for clean tests
    process.env = { ...originalEnv };
    delete process.env.CORS_ORIGIN;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('CORS origin configuration', () => {
    it('should return default multiple origins when CORS_ORIGIN is not set', () => {
      const config = getEnvironmentConfig();
      
      expect(Array.isArray(config.security.cors.origin)).toBe(true);
      const origins = config.security.cors.origin as string[];
      expect(origins).toContain('http://localhost:3000');
      expect(origins).toContain('http://localhost:4200');
      expect(origins).toContain('http://localhost:5173');
    });

    it('should parse single origin from CORS_ORIGIN environment variable', () => {
      process.env.CORS_ORIGIN = 'http://localhost:8080';
      
      const config = getEnvironmentConfig();
      
      expect(config.security.cors.origin).toBe('http://localhost:8080');
    });

    it('should parse multiple origins from comma-separated CORS_ORIGIN', () => {
      process.env.CORS_ORIGIN = 'http://localhost:3000,http://localhost:4200,https://example.com';
      
      const config = getEnvironmentConfig();
      
      expect(Array.isArray(config.security.cors.origin)).toBe(true);
      const origins = config.security.cors.origin as string[];
      expect(origins).toEqual(['http://localhost:3000', 'http://localhost:4200', 'https://example.com']);
    });

    it('should parse multiple origins from JSON array CORS_ORIGIN', () => {
      process.env.CORS_ORIGIN = '["http://localhost:3000","https://app.example.com","https://api.example.com"]';
      
      const config = getEnvironmentConfig();
      
      expect(Array.isArray(config.security.cors.origin)).toBe(true);
      const origins = config.security.cors.origin as string[];
      expect(origins).toEqual(['http://localhost:3000', 'https://app.example.com', 'https://api.example.com']);
    });

    it('should handle malformed JSON gracefully and fall back to comma parsing', () => {
      process.env.CORS_ORIGIN = 'malformed,http://localhost:3000,http://localhost:4200';
      
      const config = getEnvironmentConfig();
      
      expect(Array.isArray(config.security.cors.origin)).toBe(true);
      const origins = config.security.cors.origin as string[];
      expect(origins).toEqual(['malformed', 'http://localhost:3000', 'http://localhost:4200']);
    });

    it('should preserve other CORS configuration properties', () => {
      const config = getEnvironmentConfig();
      
      expect(config.security.cors.credentials).toBe(true);
      expect(config.security.cors.methods).toEqual(['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
      expect(config.security.cors.allowedHeaders).toEqual(['Content-Type', 'Authorization']);
    });
  });
});
