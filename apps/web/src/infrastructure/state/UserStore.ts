import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { container, TOKENS } from '../di/container';
import { IUserQueryService, UserDto } from '@nx-starter/application-shared';
import { extractErrorMessage } from '../utils/ErrorMapping';

interface UserState {
  // Query state
  users: UserDto[];
  isLoading: boolean;
  error: string | null;
  
  // Query actions
  fetchUsers: () => Promise<void>;
  clearError: () => void;
}

/**
 * User Store - CQRS Query Side
 * Manages user data fetching and display state
 */
export const useUserStore = create<UserState>()(
  devtools(
    (set, get) => ({
      // Initial state
      users: [],
      isLoading: false,
      error: null,

      // Query actions
      fetchUsers: async () => {
        const currentState = get();
        if (currentState.isLoading) return; // Prevent concurrent requests

        set({ isLoading: true, error: null });
        
        try {
          const userQueryService = container.resolve<IUserQueryService>(TOKENS.UserQueryService);
          const users = await userQueryService.getAllUsers();
          
          set({ 
            users,
            isLoading: false,
            error: null 
          });
        } catch (error) {
          const errorMessage = extractErrorMessage(error);
          set({ 
            isLoading: false, 
            error: errorMessage,
            users: [] // Reset users on error
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'user-store',
    }
  )
);
