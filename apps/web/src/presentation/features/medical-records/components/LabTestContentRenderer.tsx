import React from 'react';
import { AddLabTestResultForm } from './AddLabTestResultForm';
import { LabTest } from '../types';
import { PatientData } from '../utils/viewLabTestResultUtils';
import { UrinalysisReportView } from './urinalysis-report/UrinalysisReportView';
import { BloodChemistryReportView } from './blood-chemistry-report/BloodChemistryReportView';
import { FecalysisReportView } from './fecalysis-report/FecalysisReportView';
import { EcgReportView } from './ecg-report/EcgReportView';
import { SerologyReportView } from './serology-report/SerologyReportView';

export interface LabTestContentProps {
  isUrinalysisTest: boolean;
  isBloodChemistryTest: boolean;
  isFecalysisTest: boolean;
  isEcgTest: boolean;
  isSerologyTest: boolean;
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
  isFecalysisTest,
  isEcgTest,
  isSerologyTest,
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

  if (isFecalysisTest) {
    return (
      <FecalysisReportView
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

  if (isEcgTest) {
    return (
      <EcgReportView
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

  if (isSerologyTest) {
    return (
      <SerologyReportView
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