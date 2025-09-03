import { useAuthStore } from '../../../../infrastructure/state/AuthStore';

export const useCurrentUser = () => {
  const currentUser = useAuthStore((state) => state.user);
  
  const getUserFromLocalStorage = () => {
    try {
      const userJson = localStorage.getItem('auth_user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      return null;
    }
  };
  
  const effectiveUser = currentUser || getUserFromLocalStorage();
  const currentStaffId = effectiveUser?.id || '';
  const currentStaffName = effectiveUser ? `${effectiveUser.firstName} ${effectiveUser.lastName}` : '';
  
  return {
    currentUser: effectiveUser,
    currentStaffId,
    currentStaffName,
  };
};