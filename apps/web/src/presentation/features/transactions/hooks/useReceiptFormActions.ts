import { useCallback } from 'react';
import { AddTransactionFormData } from '@nx-starter/application-shared';
import { useCurrentUser } from './useCurrentUser';
import { COMMON_SERVICES } from '../config/receiptFormConfig';

export const useReceiptFormActions = (
  append: (item: { serviceName: string; description: string; quantity: number; unitPrice: number }) => void,
  onSubmit: (data: AddTransactionFormData) => Promise<boolean>
) => {
  const { currentStaffId } = useCurrentUser();

  const addItem = useCallback(() => {
    append({ serviceName: '', description: '', quantity: 1, unitPrice: 0 });
  }, [append]);

  const addCommonService = useCallback((service: typeof COMMON_SERVICES[0]) => {
    append({
      serviceName: service.name,
      description: '',
      quantity: 1,
      unitPrice: service.unitPrice,
    });
  }, [append]);

  const handleFormSubmit = useCallback(async (data: AddTransactionFormData) => {
    // Filter out empty items and only include description if it's not empty
    const validItems = data.items
      .filter(item => 
        item.serviceName.trim() && item.quantity > 0 && item.unitPrice > 0
      )
      .map(item => {
        const cleanItem: {
          serviceName: string;
          quantity: number;
          unitPrice: number;
          description?: string;
        } = {
          serviceName: item.serviceName.trim(),
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        };
        
        // Only include description if it's not empty
        if (item.description && item.description.trim()) {
          cleanItem.description = item.description.trim();
        }
        
        return cleanItem;
      });

    if (validItems.length === 0) {
      return false;
    }

    const formData = {
      ...data,
      receivedById: currentStaffId,
      items: validItems,
    } as AddTransactionFormData;

    return await onSubmit(formData);
  }, [currentStaffId, onSubmit]);

  return {
    addItem,
    addCommonService,
    handleFormSubmit,
  };
};