import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePatientDetailsNavigation = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('patient-info');

  const handleGoBack = () => {
    navigate('/patients');
  };

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
  };

  return {
    activeTab,
    handleGoBack,
    handleTabChange,
  };
};