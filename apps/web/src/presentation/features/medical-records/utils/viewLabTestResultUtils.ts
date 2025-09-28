export interface PatientData {
  patientNumber: string;
  patientName: string;
  age: number;
  sex: string;
}

export const isUrinalysisTest = (testCategory?: string): boolean => {
  return testCategory === 'urinalysis';
};

export const isBloodChemistryTest = (testCategory?: string): boolean => {
  const normalized = testCategory?.toLowerCase();
  return normalized === 'bloodchemistry' || normalized === 'blood chemistry';
};

export const preparePatientData = (
  patientInfo?: {
    patientNumber?: string;
    patientName?: string;
    age?: number;
    sex?: string;
  } | null
): PatientData => {
  return {
    patientNumber: patientInfo?.patientNumber || '',
    patientName: patientInfo?.patientName || '',
    age: patientInfo?.age || 0,
    sex: patientInfo?.sex || '',
  };
};

export const prepareUrinalysisPatientData = (
  patientData: PatientData,
  dateRequested: string
) => {
  return {
    ...patientData,
    dateRequested,
  };
};

export const prepareLabTestFormProps = (
  selectedLabTest: any,
  labData: any,
  isLoading: boolean,
  patientData: PatientData,
  error: string | null,
  onBack: () => void
) => {
  return {
    testType: selectedLabTest?.testCategory,
    viewMode: true,
    enabledFields: selectedLabTest?.enabledFields || [],
    existingData: labData,
    isLoadingData: isLoading,
    patientData,
    onSubmit: () => { /* No-op for view mode */ },
    onCancel: onBack,
    error,
  };
};