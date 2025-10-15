// Common services for quick selection
export const COMMON_SERVICES = [
  { name: 'Consultation', unitPrice: 800.0 },
  { name: 'Lab Tests', unitPrice: 350.0 },
  { name: 'Medication', unitPrice: 100.0 },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'Cash', label: 'Cash' },
  { value: 'GCash', label: 'GCash' },
  { value: 'Credit Card', label: 'Credit Card' },
  { value: 'Debit Card', label: 'Debit Card' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
  { value: 'Check', label: 'Check' },
];

export const getServiceOptions = () => {
  return COMMON_SERVICES.map(service => ({
    value: service.name,
    label: service.name,
  }));
};