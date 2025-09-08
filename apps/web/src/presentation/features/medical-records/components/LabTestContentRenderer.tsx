import React from 'react';
import { AddLabTestResultForm } from './AddLabTestResultForm';
import { UrinalysisReportView } from './UrinalysisReportView';
import { LabTest } from '../types';
import { PatientData } from '../utils/viewLabTestResultUtils';

export interface LabTestContentProps {
  isUrinalysisTest: boolean;
  patientData: PatientData;
  labData: Record<string, string> | null;
  selectedLabTest: LabTest | null;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
}

export const LabTestContentRenderer: React.FC<LabTestContentProps> = ({
  isUrinalysisTest,
  patientData,
  labData,
  selectedLabTest,
  isLoading,
  error,
  onBack,
}) => {
  return isUrinalysisTest ? (
    <UrinalysisReportView
      patientData={{
        patientNumber: patientData.patientNumber,
        patientName: patientData.patientName,
        age: patientData.age,
        sex: patientData.sex,
        dateRequested: selectedLabTest?.date || ''
      }}
      labData={labData}
      onBack={onBack}
    />
  ) : (
    <AddLabTestResultForm
      testType={selectedLabTest?.testCategory}
      viewMode={true}
      enabledFields={selectedLabTest?.enabledFields || []}
      existingData={labData}
      isLoadingData={isLoading}
      patientData={{
        patientNumber: patientData.patientNumber,
        patientName: patientData.patientName,
        age: patientData.age,
        sex: patientData.sex
      }}
      onSubmit={() => { /* No-op for view mode */ }}
      onCancel={onBack}
      error={error}
    />
  );
};