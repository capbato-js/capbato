import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddTransactionFormSchema, type AddTransactionFormData } from '@nx-starter/application-shared';
import { useCurrentUser } from './useCurrentUser';

export const useReceiptFormState = () => {
  const { currentStaffId } = useCurrentUser();

  const form = useForm<AddTransactionFormData>({
    resolver: zodResolver(AddTransactionFormSchema),
    mode: 'onBlur',
    defaultValues: {
      patientId: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Cash',
      receivedById: currentStaffId,
      items: [{
        serviceName: '',
        description: '',
        quantity: 1,
        unitPrice: 0
      }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  return {
    ...form,
    fields,
    append,
    remove,
  };
};