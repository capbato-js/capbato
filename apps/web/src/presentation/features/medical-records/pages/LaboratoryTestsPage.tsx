import React from 'react';
import { MedicalClinicLayout } from '../../../components/layout';
import { ConfirmationModal } from '../../../components/common';
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
    selectedLabTest,
    bloodChemistryData,
    isLoading,
    error,
    
    // Modal state
    addResultModalOpened,
    viewResultModalOpened,
    isUpdateMode,
    cancelConfirmationModalOpened,
    testToCancel,
    
    // Actions
    handleBackToLaboratory,
    handleViewTest,
    handleEditTest,
    handleAddResult,
    handleCancelTest,
    handleCloseModal,
    handleSubmitResult,
    setViewResultModalOpened,
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
        addResultModalOpened={addResultModalOpened}
        onCloseAddResultModal={handleCloseModal}
        onSubmitResult={handleSubmitResult}
        viewResultModalOpened={viewResultModalOpened}
        onCloseViewResultModal={() => setViewResultModalOpened(false)}
        selectedLabTest={selectedLabTest}
        patientInfo={patientInfo}
        bloodChemistryData={bloodChemistryData}
        isLoading={isLoading}
        error={error}
        isUpdateMode={isUpdateMode}
      />

      <ConfirmationModal
        isOpen={cancelConfirmationModalOpened}
        onClose={handleCloseCancelConfirmation}
        onConfirm={handleConfirmCancel}
        title="Cancel Lab Test"
        message={`Are you sure you want to cancel the ${testToCancel?.testName || testToCancel?.testCategory || ''} test?`}
        confirmText="Cancel"
        cancelText="No"
        confirmColor="red"
        isLoading={isLoading}
      />
    </MedicalClinicLayout>
  );
};