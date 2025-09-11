import { LAB_TEST_ITEMS } from '../constants/labTestConstants';

export const createFormSubmitHandler = (
  onSubmit: (data: any) => Promise<void>,
  selectedTests: string[]
) => {
  return async (data: any) => {
    await onSubmit({
      ...data,
      selectedTests,
    });
  };
};

export const handleDateChange = (
  value: Date | null,
  fieldOnChange: (value: string) => void
) => {
  let dateString = '';
  if (value && typeof value === 'object' && 'getTime' in value) {
    const dateObj = value as Date;
    if (!isNaN(dateObj.getTime())) {
      dateString = dateObj.toISOString().split('T')[0];
    }
  }
  fieldOnChange(dateString);
};

export const categorizeTests = () => {
  return {
    routineTests: LAB_TEST_ITEMS.filter(test => test.category === 'ROUTINE'),
    serologyTests: LAB_TEST_ITEMS.filter(test => test.category === 'SEROLOGY_IMMUNOLOGY'),
    bloodChemistryTests: LAB_TEST_ITEMS.filter(test => test.category === 'BLOOD_CHEMISTRY'),
    miscellaneousTests: LAB_TEST_ITEMS.filter(test => test.category === 'MISCELLANEOUS'),
    thyroidTests: LAB_TEST_ITEMS.filter(test => test.category === 'THYROID_FUNCTION'),
  };
};