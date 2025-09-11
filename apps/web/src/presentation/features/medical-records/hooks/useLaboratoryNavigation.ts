import { useNavigate } from 'react-router-dom';
import { LaboratoryResult } from '../types';

export const useLaboratoryNavigation = () => {
  const navigate = useNavigate();

  const handleAddTest = () => {
    navigate('/laboratory/new');
  };

  const handleViewResult = (result: LaboratoryResult) => {
    navigate(`/laboratory/tests/${result.patientId}`);
  };

  return {
    handleAddTest,
    handleViewResult,
  };
};