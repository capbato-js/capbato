import React from 'react';
import { Modal } from '../../../components/common';
import { AddLabTestResultForm } from './AddLabTestResultForm';
import { LabTest } from '../types';
import { PatientInfo } from '../view-models/useLaboratoryTestsViewModel';

interface LaboratoryTestsModalsProps {
  // Add Result Modal
  addResultModalOpened: boolean;
  onCloseAddResultModal: () => void;
  onSubmitResult: () => Promise<void>;
  
  // View Result Modal
  viewResultModalOpened: boolean;
  onCloseViewResultModal: () => void;
  
  // Common data
  selectedLabTest: LabTest | null;
  patientInfo: PatientInfo | null;
  bloodChemistryData: Record<string, string>;
  isLoading: boolean;
  error: string | null;
  
  // Utility functions
  mapLabRequestFieldsToFormIds: (tests: string[]) => string[];
  expandLipidProfile: (tests: string[]) => string[];
}

export const LaboratoryTestsModals: React.FC<LaboratoryTestsModalsProps> = ({
  addResultModalOpened,
  onCloseAddResultModal,
  onSubmitResult,
  viewResultModalOpened,
  onCloseViewResultModal,
  selectedLabTest,
  patientInfo,
  bloodChemistryData,
  isLoading,
  error,
  mapLabRequestFieldsToFormIds,
  expandLipidProfile
}) => {
  const getEnabledFields = (test: LabTest): string[] => {
    const mappedTests = mapLabRequestFieldsToFormIds(test.tests);
    return expandLipidProfile(mappedTests);
  };

  return (
    <>
      {/* Add Lab Test Result Modal */}
      {selectedLabTest && patientInfo && (
        <Modal
          opened={addResultModalOpened}
          onClose={onCloseAddResultModal}
          title=""
          size="xl"
          customStyles={{
            body: {
              padding: '0 24px 24px',
            }
          }}
        >
          <AddLabTestResultForm
            testType={selectedLabTest.testCategory}
            enabledFields={getEnabledFields(selectedLabTest)}
            patientData={{
              patientNumber: patientInfo.patientNumber,
              patientName: patientInfo.patientName,
              age: patientInfo.age || 0,
              sex: patientInfo.sex || ''
            }}
            onSubmit={onSubmitResult}
            isLoading={isLoading}
            error={error}
          />
        </Modal>
      )}

      {/* View Result Modal */}
      {selectedLabTest && viewResultModalOpened && patientInfo && (
        <Modal
          opened={viewResultModalOpened}
          onClose={onCloseViewResultModal}
          title="View Lab Test Result"
          size="xl"
          customStyles={{
            body: {
              padding: '0 24px 24px',
            }
          }}
        >
          <AddLabTestResultForm
            testType={selectedLabTest.testCategory}
            viewMode={true}
            enabledFields={getEnabledFields(selectedLabTest)}
            existingData={bloodChemistryData}
            patientData={{
              patientNumber: patientInfo.patientNumber,
              patientName: patientInfo.patientName,
              age: patientInfo.age || 0,
              sex: patientInfo.sex || ''
            }}
            onSubmit={() => { /* No-op for view mode */ }}
            onCancel={onCloseViewResultModal}
          />
        </Modal>
      )}
    </>
  );
};
