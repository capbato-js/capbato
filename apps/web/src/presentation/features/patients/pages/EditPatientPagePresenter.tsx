import React from 'react';
import { MedicalClinicLayout } from '../../../components/layout';
import { PatientForm } from '../components';
import { PatientPageHeader } from '../components/PatientPageHeader';
import { LoadingState } from '../components/LoadingState';
import { PATIENT_PAGE_TITLES, PATIENT_PAGE_MODES, PATIENT_PAGE_MESSAGES } from '../config/patientPagesConfig';
import { PatientFormData } from '../hooks/usePatientFormState';

interface EditPatientPagePresenterProps {
  isLoadingPatient: boolean;
  patientNotFound: boolean;
  initialData?: Partial<PatientFormData>;
  onFormSubmit: any;
  onCancel: () => void;
  isLoading: boolean;
  error: unknown;
}

export const EditPatientPagePresenter: React.FC<EditPatientPagePresenterProps> = ({
  isLoadingPatient,
  patientNotFound,
  initialData,
  onFormSubmit,
  onCancel,
  isLoading,
  error
}) => {
  return (
    <MedicalClinicLayout>
      <PatientPageHeader
        title={PATIENT_PAGE_TITLES.edit}
        onBack={onCancel}
      />

      {isLoadingPatient ? (
        <LoadingState message={PATIENT_PAGE_MESSAGES.loadingPatient} />
      ) : patientNotFound ? (
        <LoadingState message={PATIENT_PAGE_MESSAGES.patientNotFound} />
      ) : (
        <PatientForm
          mode={PATIENT_PAGE_MODES.update}
          initialData={initialData}
          onSubmit={onFormSubmit}
          onCancel={onCancel}
          isLoading={isLoading}
          error={error}
        />
      )}
    </MedicalClinicLayout>
  );
};