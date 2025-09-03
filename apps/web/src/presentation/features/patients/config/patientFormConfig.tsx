import React from 'react';
import { Icon } from '../../../components/common';

export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' }
] as const;

export const FORM_FIELD_CONFIG = {
  maxLengths: {
    contactNumber: 11,
    guardianContactNumber: 11
  },
  placeholders: {
    lastName: 'Enter last name',
    firstName: 'Enter first name', 
    middleName: 'Enter middle name',
    dateOfBirth: 'Enter date',
    gender: 'Select',
    contactNumber: '09123456789',
    houseNumber: 'e.g., 123',
    streetName: 'e.g., Rizal Street',
    guardianName: 'Enter guardian full name',
    guardianRelationship: 'e.g., Mother, Father',
    guardianContactNumber: '09123456789',
    guardianHouseNumber: 'e.g., 123',
    guardianStreetName: 'e.g., Rizal Street'
  }
} as const;

export const SECTION_HEADERS = {
  patient: 'PATIENT\'S INFORMATION',
  guardian: 'GUARDIAN INFORMATION'
} as const;

export const SUBSECTION_HEADERS = {
  addressDetails: 'Address Details:',
  guardianAddressDetails: 'Guardian Address Details:'
} as const;

export const FORM_ACTIONS = {
  cancel: {
    variant: 'filled' as const,
    color: 'gray' as const,
    icon: 'fas fa-times',
    text: 'Cancel'
  },
  submit: {
    icon: 'fas fa-save',
    text: 'Submit',
    loadingText: 'Submitting...'
  }
} as const;

export const FORM_STYLES = {
  sectionHeader: {
    size: 'lg' as const,
    fw: 700,
    paddingBottom: '8px'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    paddingTop: '20px',
    borderTop: '1px solid #e9ecef',
    marginTop: '20px'
  },
  alertStyle: {
    marginBottom: '20px'
  }
} as const;

export const getFormActionButtons = () => ({
  cancelIcon: <Icon icon="fas fa-times" style={{ marginRight: '4px' }} />,
  submitIcon: <Icon icon="fas fa-save" style={{ marginRight: '4px' }} />
});

export const getDateInputProps = () => ({
  valueFormat: "MMM D, YYYY" as const,
  leftSection: <Icon icon="fas fa-calendar" size={14} />,
  style: { width: '100%' }
});