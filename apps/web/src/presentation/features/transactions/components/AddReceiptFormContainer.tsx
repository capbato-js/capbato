import React, { useEffect } from 'react';
import { AddTransactionFormData } from '@nx-starter/application-shared';
import { useReceiptFormState } from '../hooks/useReceiptFormState';
import { usePatientData } from '../hooks/usePatientData';
import { useReceiptFormActions } from '../hooks/useReceiptFormActions';
import { AddReceiptFormPresenter } from './AddReceiptFormPresenter';

export interface AddReceiptFormContainerProps {
  onSubmit: (data: AddTransactionFormData) => Promise<boolean>;
  isLoading: boolean;
  error?: string | null;
  onClearError?: () => void;
}

export const AddReceiptFormContainer: React.FC<AddReceiptFormContainerProps> = ({
  onSubmit,
  isLoading,
  error,
  onClearError,
}) => {
  const formState = useReceiptFormState();
  const { patients, selectedPatientNumber, updateSelectedPatientNumber } = usePatientData();
  const actions = useReceiptFormActions(formState.append, onSubmit);

  // Watch form values
  const patientId = formState.watch('patientId');
  const date = formState.watch('date');
  const paymentMethod = formState.watch('paymentMethod');
  const items = formState.watch('items');

  // Update patient number when patient changes
  useEffect(() => {
    updateSelectedPatientNumber(patientId);
  }, [patientId, updateSelectedPatientNumber]);

  // Clear errors when form values change
  useEffect(() => {
    if (error && onClearError) {
      onClearError();
    }
  }, [patientId, date, paymentMethod, items, error, onClearError]);

  return (
    <AddReceiptFormPresenter
      // Form state
      control={formState.control}
      handleSubmit={formState.handleSubmit}
      watch={formState.watch}
      errors={formState.formState.errors}
      fields={formState.fields}
      
      // Data
      patients={patients}
      selectedPatientNumber={selectedPatientNumber}
      items={items}
      patientId={patientId}
      date={date}
      paymentMethod={paymentMethod}
      
      // Actions
      onFormSubmit={actions.handleFormSubmit}
      onAddItem={actions.addItem}
      onRemoveItem={formState.remove}
      
      // Props
      isLoading={isLoading}
      error={error}
    />
  );
};