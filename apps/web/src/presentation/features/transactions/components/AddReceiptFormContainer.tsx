import React, { useEffect, useState } from 'react';
import { AddTransactionFormData } from '@nx-starter/application-shared';
import { useReceiptFormState } from '../hooks/useReceiptFormState';
import { usePatientData } from '../hooks/usePatientData';
import { useReceiptFormActions } from '../hooks/useReceiptFormActions';
import { useUnpaidLabRequests } from '../hooks/useUnpaidLabRequests';
import { fetchLabRequestReceiptItems } from '../utils/labRequestUtils';
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

  // Lab request state (must be before useReceiptFormActions)
  const [selectedLabRequestId, setSelectedLabRequestId] = useState<string | null>(null);

  const actions = useReceiptFormActions(formState.append, onSubmit, selectedLabRequestId);

  // Watch form values
  const patientId = formState.watch('patientId');
  const date = formState.watch('date');
  const paymentMethod = formState.watch('paymentMethod');
  const items = formState.watch('items');

  // Loading state for lab items
  const [isLoadingLabItems, setIsLoadingLabItems] = useState(false);
  const { labRequests, isLoading: isLoadingLabRequests } = useUnpaidLabRequests(patientId);

  // Handle lab request selection
  const handleLabRequestSelect = async (labRequestId: string | null) => {
    setSelectedLabRequestId(labRequestId);

    if (!labRequestId) {
      return;
    }

    setIsLoadingLabItems(true);
    try {
      const labItems = await fetchLabRequestReceiptItems(labRequestId);

      // Remove all existing items first (clear the form)
      const currentItemCount = formState.fields.length;
      for (let i = currentItemCount - 1; i >= 0; i--) {
        formState.remove(i);
      }

      // Append lab items to replace the cleared items (without auto-focusing)
      labItems.forEach(item => {
        formState.append(item, { shouldFocus: false });
      });
    } catch (err) {
      console.error('Error loading lab request items:', err);
    } finally {
      setIsLoadingLabItems(false);
    }
  };

  // Update patient number when patient changes
  useEffect(() => {
    updateSelectedPatientNumber(patientId);
  }, [patientId, updateSelectedPatientNumber]);

  // Reset lab request selection when patient changes (separate effect to avoid clearing on every render)
  useEffect(() => {
    setSelectedLabRequestId(null);
  }, [patientId]);

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

      // Lab request data
      labRequests={labRequests}
      selectedLabRequestId={selectedLabRequestId}
      isLoadingLabRequests={isLoadingLabRequests}
      isLoadingLabItems={isLoadingLabItems}

      // Actions
      onFormSubmit={actions.handleFormSubmit}
      onAddItem={actions.addItem}
      onRemoveItem={formState.remove}
      onLabRequestSelect={handleLabRequestSelect}

      // Props
      isLoading={isLoading}
      error={error}
    />
  );
};