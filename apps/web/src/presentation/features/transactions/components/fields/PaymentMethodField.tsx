import React from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { AddTransactionFormData } from '@nx-starter/application-shared';
import { FormSelect } from '../../../../components/ui/FormSelect';
import { PAYMENT_METHOD_OPTIONS } from '../../config/receiptFormConfig';

interface PaymentMethodFieldProps {
  control: Control<AddTransactionFormData>;
  errors: FieldErrors<AddTransactionFormData>;
}

export const PaymentMethodField: React.FC<PaymentMethodFieldProps> = ({ 
  control, 
  errors 
}) => {
  return (
    <Controller
      name="paymentMethod"
      control={control}
      render={({ field }) => (
        <FormSelect
          {...field}
          label="Payment Method *"
          placeholder="Select payment method"
          data={PAYMENT_METHOD_OPTIONS}
          error={errors.paymentMethod?.message}
        />
      )}
    />
  );
};