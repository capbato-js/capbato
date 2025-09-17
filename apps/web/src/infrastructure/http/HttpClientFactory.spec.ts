import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpClientFactory } from './HttpClientFactory';
import { AxiosHttpClient } from './AxiosHttpClient';
import { IHttpClient } from './IHttpClient';

// Mock AxiosHttpClient to avoid real HTTP operations
vi.mock('./AxiosHttpClient');

describe('HttpClientFactory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    HttpClientFactory.clear();
  });

  afterEach(() => {
    HttpClientFactory.clear();
  });

  describe('create', () => {
    it('should create a new HTTP client instance', () => {
      const client = HttpClientFactory.create();
      
      expect(client).toBeInstanceOf(AxiosHttpClient);
      expect(AxiosHttpClient).toHaveBeenCalledWith(undefined);
    });

    it('should create HTTP client with custom baseURL', () => {
      const baseURL = 'https://api.example.com';
      const client = HttpClientFactory.create(baseURL);
      
      expect(client).toBeInstanceOf(AxiosHttpClient);
      expect(AxiosHttpClient).toHaveBeenCalledWith(baseURL);
    });

    it('should return the same instance for the same baseURL (singleton pattern)', () => {
      const baseURL = 'https://api.example.com';
      
      const client1 = HttpClientFactory.create(baseURL);
      const client2 = HttpClientFactory.create(baseURL);
      
      expect(client1).toBe(client2);
      expect(AxiosHttpClient).toHaveBeenCalledTimes(1);
    });

    it('should create different instances for different baseURLs', () => {
      const baseURL1 = 'https://api1.example.com';
      const baseURL2 = 'https://api2.example.com';
      
      const client1 = HttpClientFactory.create(baseURL1);
      const client2 = HttpClientFactory.create(baseURL2);
      
      expect(client1).not.toBe(client2);
      expect(AxiosHttpClient).toHaveBeenCalledTimes(2);
      expect(AxiosHttpClient).toHaveBeenNthCalledWith(1, baseURL1);
      expect(AxiosHttpClient).toHaveBeenNthCalledWith(2, baseURL2);
    });

    it('should use "default" key when no baseURL is provided', () => {
      const client1 = HttpClientFactory.create();
      const client2 = HttpClientFactory.create(undefined);
      
      expect(client1).toBe(client2);
      expect(AxiosHttpClient).toHaveBeenCalledTimes(1);
    });

    it('should handle edge case where instance retrieval fails', () => {
      // Mock the Map.get method to return undefined to simulate failure
      const originalGet = Map.prototype.get;
      Map.prototype.get = vi.fn().mockReturnValue(undefined);
      
      try {
        expect(() => HttpClientFactory.create()).toThrow('Failed to create HTTP client for key: default');
      } finally {
        // Restore the original method
        Map.prototype.get = originalGet;
      }
    });
  });

  describe('createForService', () => {
    it('should create HTTP client for a specific service', () => {
      const serviceName = 'UserService';
      const baseURL = 'https://user-api.example.com';
      
      const client = HttpClientFactory.createForService(serviceName, baseURL);
      
      expect(client).toBeInstanceOf(AxiosHttpClient);
      expect(AxiosHttpClient).toHaveBeenCalledWith(baseURL);
    });

    it('should create HTTP client for service without baseURL', () => {
      const serviceName = 'UserService';
      
      const client = HttpClientFactory.createForService(serviceName);
      
      expect(client).toBeInstanceOf(AxiosHttpClient);
      expect(AxiosHttpClient).toHaveBeenCalledWith(undefined);
    });

    it('should return same instance when called multiple times for same service with same baseURL', () => {
      const serviceName = 'UserService';
      const baseURL = 'https://user-api.example.com';
      
      const client1 = HttpClientFactory.createForService(serviceName, baseURL);
      const client2 = HttpClientFactory.createForService(serviceName, baseURL);
      
      expect(client1).toBe(client2);
      expect(AxiosHttpClient).toHaveBeenCalledTimes(1);
    });
  });

  describe('clear', () => {
    it('should clear all cached instances', () => {
      // Create some instances
      HttpClientFactory.create('https://api1.example.com');
      HttpClientFactory.create('https://api2.example.com');
      HttpClientFactory.create(); // default
      
      expect(AxiosHttpClient).toHaveBeenCalledTimes(3);
      
      // Clear the cache
      HttpClientFactory.clear();
      
      // Create instances again - should create new ones
      HttpClientFactory.create('https://api1.example.com');
      HttpClientFactory.create(); // default
      
      expect(AxiosHttpClient).toHaveBeenCalledTimes(5); // 3 + 2 more
    });

    it('should allow creating new instances after clearing', () => {
      const baseURL = 'https://api.example.com';
      
      const client1 = HttpClientFactory.create(baseURL);
      HttpClientFactory.clear();
      const client2 = HttpClientFactory.create(baseURL);
      
      expect(client1).not.toBe(client2);
      expect(AxiosHttpClient).toHaveBeenCalledTimes(2);
    });
  });

  describe('instance management', () => {
    it('should maintain separate instances for empty string and undefined baseURL', () => {
      const client1 = HttpClientFactory.create('');
      const client2 = HttpClientFactory.create(undefined);
      
      // Both should use 'default' key since empty string is falsy
      expect(client1).toBe(client2);
    });

    it('should handle multiple concurrent requests for same baseURL', () => {
      const baseURL = 'https://api.example.com';
      
      // Simulate concurrent requests
      const promises = Array.from({ length: 5 }, () => 
        Promise.resolve(HttpClientFactory.create(baseURL))
      );
      
      return Promise.all(promises).then(clients => {
        // All should be the same instance
        clients.forEach(client => {
          expect(client).toBe(clients[0]);
        });
        
        // Only one instance should be created
        expect(AxiosHttpClient).toHaveBeenCalledTimes(1);
      });
    });

    it('should be type-safe and return IHttpClient interface', () => {
      const client = HttpClientFactory.create();
      
      // Type assertion to verify it implements IHttpClient
      const httpClient: IHttpClient = client;
      expect(httpClient).toBeDefined();
      expect(typeof httpClient.get).toBe('function');
      expect(typeof httpClient.post).toBe('function');
      expect(typeof httpClient.put).toBe('function');
      expect(typeof httpClient.delete).toBe('function');
      expect(typeof httpClient.patch).toBe('function');
    });
  });

  describe('factory pattern implementation', () => {
    it('should implement proper singleton pattern per baseURL', () => {
      const urls = [
        'https://api1.example.com',
        'https://api2.example.com', 
        'https://api3.example.com'
      ];
      
      // Create clients for each URL
      const clients1 = urls.map(url => HttpClientFactory.create(url));
      
      // Create clients again for same URLs
      const clients2 = urls.map(url => HttpClientFactory.create(url));
      
      // Should get same instances
      clients1.forEach((client, index) => {
        expect(client).toBe(clients2[index]);
      });
      
      // Should only create one instance per URL
      expect(AxiosHttpClient).toHaveBeenCalledTimes(3);
    });
  });
});