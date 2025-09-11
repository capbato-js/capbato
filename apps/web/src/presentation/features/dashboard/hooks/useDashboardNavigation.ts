import { useNavigate } from 'react-router-dom';

export const useDashboardNavigation = () => {
  const navigate = useNavigate();

  const handleSeeAllAppointments = () => {
    navigate('/appointments');
  };

  return {
    handleSeeAllAppointments,
  };
};