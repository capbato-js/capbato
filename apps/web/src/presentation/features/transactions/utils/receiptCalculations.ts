export const calculateSubtotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

export const calculateTotal = (items: Array<{ quantity?: number; unitPrice?: number }>): number => {
  return items.reduce((total, item) => {
    const subtotal = calculateSubtotal(item.quantity || 0, item.unitPrice || 0);
    return total + subtotal;
  }, 0);
};

export const isFormValid = (
  patientId: string,
  date: string,
  paymentMethod: string,
  items: Array<{ serviceName?: string; quantity?: number; unitPrice?: number }>
): boolean => {
  return !!(
    patientId && 
    date && 
    paymentMethod && 
    items.some(item => item.serviceName?.trim() && (item.quantity || 0) > 0 && (item.unitPrice || 0) > 0)
  );
};