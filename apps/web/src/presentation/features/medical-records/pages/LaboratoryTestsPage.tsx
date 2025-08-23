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
    selectedLabTest,
    bloodChemistryData,
    isLoading,
    error,
    
    // Modal state
    addResultModalOpened,
    viewResultModalOpened,
    isUpdateMode,
    
    // Actions
    handleBackToLaboratory,
    handleViewTest,
    handleEditTest,
    handleAddResult,
    handleCancelTest,
    handleCloseModal,
    handleSubmitResult,
    setViewResultModalOpened,
    
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
    </MedicalClinicLayout>
  );
};