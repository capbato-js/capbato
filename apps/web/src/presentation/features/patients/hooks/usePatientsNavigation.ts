import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePatientsNavigation = () => {
  const navigate = useNavigate();

  const handleAddPatient = useCallback(() => {
    navigate('/patients/new');
  }, [navigate]);

  return {
    handleAddPatient
  };
};