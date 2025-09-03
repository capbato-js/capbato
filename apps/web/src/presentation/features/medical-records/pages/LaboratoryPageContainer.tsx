import React, { useEffect } from 'react';
import { useLaboratoryData } from '../hooks/useLaboratoryData';
import { useLaboratoryNavigation } from '../hooks/useLaboratoryNavigation';
import { LaboratoryPagePresenter } from './LaboratoryPagePresenter';
import { useOverflowHidden } from '../../../hooks/useOverflowHidden';

export const LaboratoryPageContainer: React.FC = () => {
  const { 
    laboratoryResults, 
    fetchAllLabRequests, 
    loadingStates, 
    errorStates 
  } = useLaboratoryData();
  
  const navigation = useLaboratoryNavigation();

  useOverflowHidden();

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