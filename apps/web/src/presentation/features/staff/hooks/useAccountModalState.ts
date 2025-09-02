import { useState } from 'react';
import { useDisclosure } from '@mantine/hooks';
import type { Account } from '../view-models/useEnhancedAccountsViewModel';
import { DoctorDto } from '@nx-starter/application-shared';

// Modal animation duration constant to ensure consistent timing
const MODAL_ANIMATION_DURATION = 300;

export const useAccountModalState = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [updateModalOpened, { open: openUpdateModal, close: closeUpdateModal }] = useDisclosure(false);
  const [passwordModalOpened, { open: openPasswordModal, close: closePasswordModal }] = useDisclosure(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [doctorDetails, setDoctorDetails] = useState<DoctorDto | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleOpenCreateModal = () => {
    open();
  };

  const handleCloseCreateModal = (clearError: () => void, clearFieldErrors: () => void) => {
    clearError();
    clearFieldErrors();
    close();
  };

  const handleOpenUpdateModal = (account: Account, details?: DoctorDto | null) => {
    setSelectedAccount(account);
    setDoctorDetails(details || null);
    openUpdateModal();
  };

  const handleCloseUpdateModal = (clearError: () => void, clearFieldErrors: () => void) => {
    clearError();
    clearFieldErrors();
    closeUpdateModal();
    setTimeout(() => {
      setSelectedAccount(null);
      setDoctorDetails(null);
    }, MODAL_ANIMATION_DURATION);
  };

  const handleOpenPasswordModal = (account: Account) => {
    setSelectedAccount(account);
    setPasswordError(null);
    openPasswordModal();
  };

  const handleClosePasswordModal = () => {
    setPasswordError(null);
    closePasswordModal();
    setTimeout(() => {
      setSelectedAccount(null);
    }, MODAL_ANIMATION_DURATION);
  };

  const clearSelectedAccountDelayed = () => {
    setTimeout(() => {
      setSelectedAccount(null);
      setDoctorDetails(null);
    }, MODAL_ANIMATION_DURATION);
  };

  return {
    // Modal states
    opened,
    updateModalOpened,
    passwordModalOpened,
    selectedAccount,
    doctorDetails,
    passwordError,
    
    // Actions
    handleOpenCreateModal,
    handleCloseCreateModal,
    handleOpenUpdateModal,
    handleCloseUpdateModal,
    handleOpenPasswordModal,
    handleClosePasswordModal,
    clearSelectedAccountDelayed,
    setPasswordError,
    setDoctorDetails,
  };
};