import React from 'react';
import { ViewPrescriptionModalContainer } from './ViewPrescriptionModalContainer';
import { Prescription } from '../types';

interface ViewPrescriptionModalProps {
  opened: boolean;
  onClose: () => void;
  prescription: Prescription | null;
}

export const ViewPrescriptionModal: React.FC<ViewPrescriptionModalProps> = (props) => {
  return <ViewPrescriptionModalContainer {...props} />;
};
