import React, { useEffect } from 'react';
import { useLaboratoryData } from '../hooks/useLaboratoryData';
import { useLaboratoryNavigation } from '../hooks/useLaboratoryNavigation';
import { LaboratoryPagePresenter } from './LaboratoryPagePresenter';

export const LaboratoryPageContainer: React.FC = () => {
  const { 
    laboratoryResults, 
    fetchAllLabRequests, 
    loadingStates, 
    errorStates 
  } = useLaboratoryData();
  
  const navigation = useLaboratoryNavigation();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    fetchAllLabRequests();
  }, [fetchAllLabRequests]);

  return (
    <LaboratoryPagePresenter
      laboratoryResults={laboratoryResults}
      loadingStates={loadingStates}
      errorStates={errorStates}
      onAddTest={navigation.handleAddTest}
      onViewResult={navigation.handleViewResult}
    />
  );
};