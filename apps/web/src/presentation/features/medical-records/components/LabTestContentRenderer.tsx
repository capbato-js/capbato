import React from 'react';
import { AddLabTestResultForm } from './AddLabTestResultForm';
import { LabTest } from '../types';
import { PatientData } from '../utils/viewLabTestResultUtils';
import { UrinalysisReportView } from './urinalysis-report/UrinalysisReportView';
import { BloodChemistryReportView } from './blood-chemistry-report/BloodChemistryReportView';

export interface LabTestContentProps {
  isUrinalysisTest: boolean;
  isBloodChemistryTest: boolean;
  patientData: PatientData;
  labData: Record<string, string> | null;
  selectedLabTest: LabTest | null;
  isLoading: boolean;
  error: string | null;
  onBack: () => void;
}

export const LabTestContentRenderer: React.FC<LabTestContentProps> = ({
  isUrinalysisTest,
  isBloodChemistryTest,
  patientData,
  labData,
  selectedLabTest,
  isLoading,
  error,
  onBack,
}) => {
  if (isUrinalysisTest) {
    return (
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
    );
  }

  if (isBloodChemistryTest) {
    return (
      <BloodChemistryReportView
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
    );
  }

  return (
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