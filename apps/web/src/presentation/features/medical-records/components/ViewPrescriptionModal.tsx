import React from 'react';
import { ViewPrescriptionModalContainer } from './ViewPrescriptionModalContainer';
import { Prescription } from '../types';

interface ViewPrescriptionModalProps {
  opened: boolean;
  onClose: () => void;
  prescription: Prescription | null;
  onPrint?: () => void;
  printRef?: React.RefObject<HTMLDivElement | null>;
  patientAge?: number;
  patientSex?: string;
  patientAddress?: string;
}

export const ViewPrescriptionModal: React.FC<ViewPrescriptionModalProps> = (props) => {
  return <ViewPrescriptionModalContainer {...props} />;
};
