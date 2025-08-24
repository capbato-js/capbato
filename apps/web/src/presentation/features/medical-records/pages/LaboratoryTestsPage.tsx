import React from 'react';
import { MedicalClinicLayout } from '../../../components/layout';
import { 
  LaboratoryTestsPageHeader, 
  LaboratoryTestsTable, 
  LaboratoryTestsModals 
} from '../components';
import { useLaboratoryTestsViewModel } from '../view-models';

export const LaboratoryTestsPage: React.FC = () => {
  const {
    // State
    labTests,
    patientInfo,
    isLoading,
    error,
    
    // Cancel confirmation modal state
    cancelConfirmationModalOpened,
    testToCancel,
    
    // Actions
    handleBackToLaboratory,
    handleViewTest,
    handleEditTest,
    handleAddResult,
    handleCancelTest,
    handleConfirmCancel,
    handleCloseCancelConfirmation,
    
    // Store states
    errorStates,
  } = useLaboratoryTestsViewModel();

  return (
    <MedicalClinicLayout>
      <LaboratoryTestsPageHeader
        patientInfo={patientInfo}
        onBackClick={handleBackToLaboratory}
      />
      
      <LaboratoryTestsTable
        labTests={labTests}
        isLoading={isLoading}
        errorMessage={errorStates.fetchError}
        onViewTest={handleViewTest}
  onEditTest={handleEditTest}
        onAddResult={handleAddResult}
        onCancelTest={handleCancelTest}
      />

      <LaboratoryTestsModals
        cancelConfirmationModalOpened={cancelConfirmationModalOpened}
        onCloseCancelConfirmation={handleCloseCancelConfirmation}
        onConfirmCancel={handleConfirmCancel}
        testToCancel={testToCancel}
        patientInfo={patientInfo}
        isLoading={isLoading}
        error={error}
      />
    </MedicalClinicLayout>
  );
};