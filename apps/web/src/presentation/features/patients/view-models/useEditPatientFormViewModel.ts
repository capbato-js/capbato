import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePatientStore } from '../../../../infrastructure/state/PatientStore';
import { UpdatePatientCommand } from '@nx-starter/application-shared';

interface EditPatientFormViewModel {
  isLoadingPatient: boolean;
  patientNotFound: boolean;
  initialData?: {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    dateOfBirth: string;
    gender: 'Male' | 'Female';
    contactNumber: string;
    photoUrl?: string;
    houseNumber?: string;
    streetName?: string;
    province?: string;
    cityMunicipality?: string;
    barangay?: string;
    guardianName?: string;
    guardianGender?: 'Male' | 'Female';
    guardianRelationship?: string;
    guardianContactNumber?: string;
    guardianHouseNumber?: string;
    guardianStreetName?: string;
    guardianProvince?: string;
    guardianCityMunicipality?: string;
    guardianBarangay?: string;
  };
  isLoading: boolean;
  error: unknown;
  handleFormSubmit: (data: UpdatePatientCommand) => Promise<boolean>;
  handleCancel: () => void;
}

export const useEditPatientFormViewModel = (): EditPatientFormViewModel => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [patientNotFound, setPatientNotFound] = useState(false);
  
  const {
    patientDetails,
    updatePatient,
    loadPatientById,
    getIsLoadingPatientDetails,
    getIsUpdatingPatient,
    getPatientDetails,
    getUpdatePatientError,
    clearUpdatePatientError,
  } = usePatientStore();

  const patientId = id!;
  const isLoadingPatient = getIsLoadingPatientDetails(patientId);
  const isUpdating = getIsUpdatingPatient(patientId);
  const patient = getPatientDetails(patientId);
  const updateError = getUpdatePatientError(patientId);

  // Load patient data on mount
  useEffect(() => {
    if (patientId) {
      loadPatientById(patientId);
    }
  }, [patientId, loadPatientById]);

  // Check if patient exists after loading
  useEffect(() => {
    if (!isLoadingPatient && !patient && patientDetails[patientId] === undefined) {
      setPatientNotFound(true);
    } else if (patient) {
      setPatientNotFound(false);
    }
  }, [isLoadingPatient, patient, patientDetails, patientId]);

  // Clear errors when component mounts
  useEffect(() => {
    if (patientId) {
      clearUpdatePatientError(patientId);
    }
  }, [patientId, clearUpdatePatientError]);

  const handleFormSubmit = useCallback(async (data: UpdatePatientCommand): Promise<boolean> => {
    console.log('🎯 EditPatientViewModel.handleFormSubmit called');
    console.log('📦 EditPatientViewModel: Data received:', data);
    console.log('🔍 EditPatientViewModel: photoUrl in data?', 'photoUrl' in data);
    console.log('📸 EditPatientViewModel: photoUrl value:', (data as any).photoUrl);
    console.log('🆔 EditPatientViewModel: Patient ID:', data.id);

    try {
      console.log('🚀 EditPatientViewModel: Calling updatePatient from store...');
      const result = await updatePatient(data);
      console.log('📋 EditPatientViewModel: UpdatePatient result:', result);

      if (result) {
        console.log('✅ EditPatientViewModel: Update successful, navigating to /patients');
        navigate('/patients');
        return true;
      }

      console.log('❌ EditPatientViewModel: Update failed, staying on form');
      return false;
    } catch (error) {
      console.error('❌ EditPatientViewModel: Failed to update patient:', error);
      return false;
    }
  }, [updatePatient, navigate]);

  const handleCancel = useCallback(() => {
    navigate('/patients');
  }, [navigate]);

  // Prepare initial data for the form
  const initialData = patient ? {
    id: patient.id,
    firstName: patient.firstName,
    lastName: patient.lastName,
    middleName: patient.middleName,
    dateOfBirth: patient.dateOfBirth,
    gender: patient.gender,
    contactNumber: patient.contactNumber,
    photoUrl: patient.photoUrl,
    houseNumber: patient.houseNumber,
    streetName: patient.streetName,
    province: patient.province,
    cityMunicipality: patient.cityMunicipality,
    barangay: patient.barangay,
    guardianName: patient.guardianName,
    guardianGender: patient.guardianGender,
    guardianRelationship: patient.guardianRelationship,
    guardianContactNumber: patient.guardianContactNumber,
    guardianHouseNumber: patient.guardianHouseNumber,
    guardianStreetName: patient.guardianStreetName,
    guardianProvince: patient.guardianProvince,
    guardianCityMunicipality: patient.guardianCityMunicipality,
    guardianBarangay: patient.guardianBarangay,
  } : undefined;

  return {
    isLoadingPatient,
    patientNotFound,
    initialData,
    isLoading: isUpdating,
    error: updateError,
    handleFormSubmit,
    handleCancel,
  };
};