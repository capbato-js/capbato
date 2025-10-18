import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export const usePatientDetailsNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  // Read initial tab from query parameter or default to 'patient-info'
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get('tab') || 'patient-info';

  const [activeTab, setActiveTab] = useState<string>(initialTab);

  // Update state if query param changes (e.g., browser back/forward)
  useEffect(() => {
    const currentTab = new URLSearchParams(location.search).get('tab') || 'patient-info';
    setActiveTab(currentTab);
  }, [location.search]);

  const handleGoBack = () => {
    navigate('/patients');
  };

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);

    // Update URL with new tab query parameter
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set('tab', tabValue);
    navigate(`/patients/${id}?${newSearchParams.toString()}`, { replace: true });
  };

  return {
    activeTab,
    handleGoBack,
    handleTabChange,
  };
};