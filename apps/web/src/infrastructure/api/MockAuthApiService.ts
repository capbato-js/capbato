import { injectable } from 'tsyringe';
import { IAuthApiService } from './IAuthApiService';
import { LoginUserCommand, LoginUserResponseDto, RegisterUserCommand } from '@nx-starter/application-shared';

/**
 * Mock Authentication API Service for Development
 * Provides mock responses for authentication operations when no backend is available
 */
@injectable()
export class MockAuthApiService implements IAuthApiService {
  
  async login(command: LoginUserCommand): Promise<LoginUserResponseDto> {
    console.log('🧪 MockAuthApiService.login called with:', command);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simple validation - in real app this would be handled by backend
    if (command.password === 'password123' || command.password === 'admin') {
      // Return mock successful login response
      const mockResponse: LoginUserResponseDto = {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: 'user-123',
          firstName: 'John',
          lastName: 'Doe',
          email: command.identifier.includes('@') ? command.identifier : 'john.doe@example.com',
          username: command.identifier.includes('@') ? command.identifier.split('@')[0] : command.identifier,
          role: 'admin'
        }
      };
      
      console.log('🧪 MockAuthApiService returning success:', mockResponse);
      return mockResponse;
    } else {
      // Simulate authentication failure
      console.log('🧪 MockAuthApiService returning error for invalid credentials');
      throw new Error('Invalid email/username or password');
    }
  }

  async register(command: RegisterUserCommand): Promise<{ id: string }> {
    console.log('🧪 MockAuthApiService.register called with:', command);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful registration response
    const mockResponse = {
      id: 'user-' + Date.now()
    };
    
    console.log('🧪 MockAuthApiService returning registration success:', mockResponse);
    return mockResponse;
  }

  async validateToken(token: string): Promise<{ valid: boolean; user?: any }> {
    console.log('🧪 MockAuthApiService.validateToken called with:', token);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock validation - accept any token that starts with 'mock-jwt-token-'
    if (token && token.startsWith('mock-jwt-token-')) {
      return {
        valid: true,
        user: {
          id: 'user-123',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          username: 'johndoe',
          role: 'admin'
        }
      };
    }
    
    return { valid: false };
  }

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    console.log('🧪 MockAuthApiService.refreshToken called with:', refreshToken);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return new mock token
    return {
      token: 'mock-jwt-token-refreshed-' + Date.now()
    };
  }
}
