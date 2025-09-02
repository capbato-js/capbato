import React from 'react';
import { useLaboratoryStore } from '../../../../infrastructure/state/LaboratoryStore';
import { LaboratoryResult } from '../types';
import { transformLabRequestsToResults } from '../utils/laboratoryUtils';

export const useLaboratoryData = () => {
  const { 
    labRequests, 
    fetchAllLabRequests, 
    loadingStates, 
    errorStates 
  } = useLaboratoryStore();

  const laboratoryResults: LaboratoryResult[] = React.useMemo(() => {
    return transformLabRequestsToResults(labRequests);
  }, [labRequests]);

  return {
    laboratoryResults,
    fetchAllLabRequests,
    loadingStates,
    errorStates,
  };
};