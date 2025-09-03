import React from 'react';
import { AddTransactionFormData } from '@nx-starter/application-shared';
import { AddReceiptFormContainer } from './AddReceiptFormContainer';

export interface AddReceiptFormProps {
  onSubmit: (data: AddTransactionFormData) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
}

/**
 * AddReceiptForm component handles the creation of transaction receipts
 * with form validation and proper TypeScript typing.
 * 
 * Features:
 * - Real patient data from backend
 * - Dynamic service items list with add/remove functionality
 * - Common service presets for quick selection
 * - Automatic subtotal and total calculations
 * - Payment method selection
 */
export const AddReceiptForm: React.FC<AddReceiptFormProps> = (props) => {
  return <AddReceiptFormContainer {...props} />;
};