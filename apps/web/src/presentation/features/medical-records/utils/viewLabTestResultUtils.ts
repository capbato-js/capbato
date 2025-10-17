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

export const isFecalysisTest = (testCategory?: string): boolean => {
  return testCategory === 'fecalysis';
};

export const isEcgTest = (testCategory?: string): boolean => {
  const normalized = testCategory?.toLowerCase();
  return normalized === 'ecg' || normalized === 'electrocardiogram';
};

export const isSerologyTest = (testCategory?: string): boolean => {
  const normalized = testCategory?.toLowerCase();
  return normalized === 'serology' || normalized === 'serology & immunology';
};

export const isDengueTest = (testCategory?: string): boolean => {
  const normalized = testCategory?.toLowerCase();
  return normalized === 'dengue' || normalized === 'dengue test' || normalized === 'dengue duo';
};

export const isCoagulationTest = (testCategory?: string): boolean => {
  const normalized = testCategory?.toLowerCase();
  return normalized === 'coagulation' || normalized === 'coagulation studies' || normalized === 'pt ptt';
};

export const isHematologyTest = (testCategory?: string): boolean => {
  const normalized = testCategory?.toLowerCase();
  return normalized?.includes('hematology') || 
         normalized?.includes('cbc') || 
         normalized === 'hematology' || 
         normalized === 'cbc with platelet';
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