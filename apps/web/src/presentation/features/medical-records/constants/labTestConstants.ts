// Lab test constants and mock data based on the legacy form
export interface LabTestItem {
  id: string;
  name: string;
  price?: number;
  category: 'ROUTINE' | 'BLOOD_CHEMISTRY' | 'SEROLOGY_IMMUNOLOGY' | 'THYROID_FUNCTION' | 'MISCELLANEOUS';
  disabled?: boolean; // true if no corresponding lab test result form exists
  disabledReason?: string; // explanation for why it's disabled
}

export const LAB_TEST_ITEMS: LabTestItem[] = [
  // ROUTINE Tests
  { id: 'routine_cbc_with_platelet', name: 'CBC with Platelet', price: 210, category: 'ROUTINE' },
  { id: 'routine_pregnancy_test', name: 'Pregnancy Test', price: 250, category: 'ROUTINE' },
  { id: 'routine_urinalysis', name: 'Urinalysis', price: 80, category: 'ROUTINE' },
  { id: 'routine_fecalysis', name: 'Fecalysis', price: 80, category: 'ROUTINE' },
  { id: 'routine_occult_blood_test', name: 'Occult Blood Test', price: 150, category: 'ROUTINE' },

  // SEROLOGY & IMMUNOLOGY Tests
  { id: 'serology_hepatitis_b_screening', name: 'Hepatitis B Screening', price: 250, category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },
  { id: 'serology_hepatitis_a_screening', name: 'Hepatitis A Screening', price: 450, category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },
  { id: 'serology_hepatitis_c_screening', name: 'Hepatitis C Screening', category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },
  { id: 'serology_hepatitis_profile', name: 'Hepatitis Profile', price: 1700, category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },
  { id: 'serology_vdrl_rpr', name: 'VDRL/RPR', price: 250, category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },
  { id: 'serology_crp', name: 'CRP', category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },
  { id: 'serology_dengue_ns1', name: 'Dengue NS1', price: 1200, category: 'SEROLOGY_IMMUNOLOGY' }, // HAS FORM - dengue report
  { id: 'serology_aso', name: 'ASO', category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },
  { id: 'serology_crf', name: 'CRF', category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },
  { id: 'serology_ra_rf', name: 'RA/RF', category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },
  { id: 'serology_tumor_markers', name: 'Tumor Markers', category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },
  { id: 'serology_ca_125', name: 'CA 125', category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },
  { id: 'serology_cea', name: 'CEA', category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },
  { id: 'serology_psa', name: 'PSA', price: 1300, category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },
  { id: 'serology_beta_hcg', name: 'Beta HCG', category: 'SEROLOGY_IMMUNOLOGY', disabled: true, disabledReason: 'No result form available' },

  // BLOOD CHEMISTRY Tests
  { id: 'blood_chemistry_fbs', name: 'FBS', price: 120, category: 'BLOOD_CHEMISTRY' },
  { id: 'blood_chemistry_bun', name: 'BUN', price: 120, category: 'BLOOD_CHEMISTRY' },
  { id: 'blood_chemistry_creatinine', name: 'Creatinine', price: 150, category: 'BLOOD_CHEMISTRY' },
  { id: 'blood_chemistry_blood_uric_acid', name: 'Blood Uric Acid', price: 120, category: 'BLOOD_CHEMISTRY' },
  { id: 'blood_chemistry_lipid_profile', name: 'Lipid Profile', price: 700, category: 'BLOOD_CHEMISTRY' },
  { id: 'blood_chemistry_sgot', name: 'SGOT', price: 200, category: 'BLOOD_CHEMISTRY' },
  { id: 'blood_chemistry_sgpt', name: 'SGPT', price: 200, category: 'BLOOD_CHEMISTRY' },
  { id: 'blood_chemistry_alkaline_phosphatase', name: 'Alkaline Phosphatase (ALP)', price: 300, category: 'BLOOD_CHEMISTRY' },
  { id: 'blood_chemistry_sodium', name: 'Sodium (Na)', price: 200, category: 'BLOOD_CHEMISTRY' },
  { id: 'blood_chemistry_potassium', name: 'Potassium (K+)', price: 200, category: 'BLOOD_CHEMISTRY' },
  { id: 'blood_chemistry_hba1c', name: 'HBA1C', price: 550, category: 'BLOOD_CHEMISTRY' },

  // THYROID FUNCTION Tests
  { id: 'thyroid_t3', name: 'T3', price: 500, category: 'THYROID_FUNCTION', disabled: true, disabledReason: 'No result form available' },
  { id: 'thyroid_t4', name: 'T4', price: 500, category: 'THYROID_FUNCTION', disabled: true, disabledReason: 'No result form available' },
  { id: 'thyroid_ft3', name: 'FT3', price: 600, category: 'THYROID_FUNCTION' },
  { id: 'thyroid_ft4', name: 'FT4', price: 600, category: 'THYROID_FUNCTION' },
  { id: 'thyroid_tsh', name: 'TSH', price: 600, category: 'THYROID_FUNCTION' },

  // MISCELLANEOUS Tests
  { id: 'misc_ecg', name: 'ECG', price: 250, category: 'MISCELLANEOUS' },
];

export const LAB_TEST_CATEGORIES = [
  { key: 'ROUTINE', label: 'ROUTINE' },
  { key: 'SEROLOGY_IMMUNOLOGY', label: 'SEROLOGY & IMMUNOLOGY' },
  { key: 'BLOOD_CHEMISTRY', label: 'BLOOD CHEMISTRY' },
  { key: 'THYROID_FUNCTION', label: 'THYROID FUNCTION TEST' },
  { key: 'MISCELLANEOUS', label: 'MISCELLANEOUS TEST' },
] as const;

// Helper functions for handling optional prices
export const formatTestPrice = (price?: number): string => {
  if (price === undefined || price === null) {
    return 'Price on request';
  }
  return `₱${price.toFixed(2)}`;
};

export const formatTestLabel = (name: string, price?: number): string => {
  if (price === undefined || price === null) {
    return name;
  }
  return `${name} (${formatTestPrice(price)})`;
};

export const calculateTotalPrice = (testIds: string[]): number => {
  return testIds.reduce((total, testId) => {
    const test = LAB_TEST_ITEMS.find(item => item.id === testId);
    return total + (test?.price || 0);
  }, 0);
};

export const hasValidPrice = (price?: number): boolean => {
  return price !== undefined && price !== null && price > 0;
};

// Group tests by category for easier rendering
export const getTestsByCategory = () => {
  return LAB_TEST_CATEGORIES.map(category => ({
    ...category,
    tests: LAB_TEST_ITEMS.filter(test => test.category === category.key)
  }));
};
