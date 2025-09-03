import React from 'react';
import { MedicalClinicLayout } from '../../../components/layout';
import { PatientForm } from '../components';
import { PatientPageHeader } from '../components/PatientPageHeader';
import { PATIENT_PAGE_TITLES, PATIENT_PAGE_MODES } from '../config/patientPagesConfig';

interface AddPatientPagePresenterProps {
  onFormSubmit: any;
  onCancel: () => void;
  isLoading: boolean;
  error: unknown;
}

export const AddPatientPagePresenter: React.FC<AddPatientPagePresenterProps> = ({
  onFormSubmit,
  onCancel,
  isLoading,
  error
}) => {
  return (
    <MedicalClinicLayout>
      <PatientPageHeader
        title={PATIENT_PAGE_TITLES.add}
        onBack={onCancel}
      />

      <PatientForm
        mode={PATIENT_PAGE_MODES.create}
        onSubmit={onFormSubmit}
        onCancel={onCancel}
        isLoading={isLoading}
        error={error}
      />
    </MedicalClinicLayout>
  );
};