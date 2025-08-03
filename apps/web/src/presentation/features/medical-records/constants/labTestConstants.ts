// Lab test constants and mock data based on the legacy form
export interface LabTestItem {
  id: string;
  name: string;
  price: number;
  category: 'ROUTINE' | 'BLOOD_CHEMISTRY' | 'SEROLOGY_IMMUNOLOGY' | 'THYROID_FUNCTION' | 'MISCELLANEOUS';
}

export const LAB_TEST_ITEMS: LabTestItem[] = [
  // ROUTINE Tests
  { id: 'cbc', name: 'CBC with Platelet', price: 210, category: 'ROUTINE' },
  { id: 'pregnancy', name: 'Pregnancy Test', price: 250, category: 'ROUTINE' },
  { id: 'urinalysis', name: 'Urinalysis', price: 80, category: 'ROUTINE' },
  { id: 'fecalysis', name: 'Fecalysis', price: 80, category: 'ROUTINE' },
  { id: 'occult_blood', name: 'Occult Blood Test', price: 150, category: 'ROUTINE' },

  // SEROLOGY & IMMUNOLOGY Tests
  { id: 'hepa_b', name: 'Hepa B Screening', price: 250, category: 'SEROLOGY_IMMUNOLOGY' },
  { id: 'hepa_a', name: 'Hepa A Screening', price: 450, category: 'SEROLOGY_IMMUNOLOGY' },
  { id: 'hepatitis_profile', name: 'Hepatitis Profile', price: 1100, category: 'SEROLOGY_IMMUNOLOGY' },
  { id: 'vdrl_rpr', name: 'VDRL/RPR', price: 250, category: 'SEROLOGY_IMMUNOLOGY' },
  { id: 'dengue_ns1', name: 'Dengue NS1', price: 1200, category: 'SEROLOGY_IMMUNOLOGY' },
  { id: 'ca_markers', name: 'CA 125 / CEA / PSA', price: 1300, category: 'SEROLOGY_IMMUNOLOGY' },

  // BLOOD CHEMISTRY Tests
  { id: 'fbs', name: 'FBS', price: 110, category: 'BLOOD_CHEMISTRY' },
  { id: 'bun', name: 'BUN', price: 120, category: 'BLOOD_CHEMISTRY' },
  { id: 'creatinine', name: 'Creatinine', price: 150, category: 'BLOOD_CHEMISTRY' },
  { id: 'uric_acid', name: 'Blood Uric Acid', price: 120, category: 'BLOOD_CHEMISTRY' },
  { id: 'lipid_profile', name: 'Lipid Profile', price: 700, category: 'BLOOD_CHEMISTRY' },
  { id: 'sgot', name: 'SGOT', price: 200, category: 'BLOOD_CHEMISTRY' },
  { id: 'sgpt', name: 'SGPT', price: 200, category: 'BLOOD_CHEMISTRY' },
  { id: 'alp', name: 'ALP', price: 300, category: 'BLOOD_CHEMISTRY' },
  { id: 'sodium', name: 'Sodium Na', price: 700, category: 'BLOOD_CHEMISTRY' },
  { id: 'potassium', name: 'Potassium K+', price: 200, category: 'BLOOD_CHEMISTRY' },
  { id: 'hba1c', name: 'HBA1C', price: 550, category: 'BLOOD_CHEMISTRY' },

  // THYROID FUNCTION Tests
  { id: 't3', name: 'T3', price: 500, category: 'THYROID_FUNCTION' },
  { id: 't4', name: 'T4', price: 500, category: 'THYROID_FUNCTION' },
  { id: 'ft3', name: 'FT3', price: 1000, category: 'THYROID_FUNCTION' },
  { id: 'ft4', name: 'FT4', price: 600, category: 'THYROID_FUNCTION' },
  { id: 'tsh', name: 'TSH', price: 600, category: 'THYROID_FUNCTION' },

  // MISCELLANEOUS Tests
  { id: 'ecg', name: 'ECG', price: 250, category: 'MISCELLANEOUS' },
];

export const LAB_TEST_CATEGORIES = [
  { key: 'ROUTINE', label: 'ROUTINE' },
  { key: 'SEROLOGY_IMMUNOLOGY', label: 'SEROLOGY & IMMUNOLOGY' },
  { key: 'BLOOD_CHEMISTRY', label: 'BLOOD CHEMISTRY' },
  { key: 'THYROID_FUNCTION', label: 'THYROID FUNCTION TEST' },
  { key: 'MISCELLANEOUS', label: 'MISCELLANEOUS TEST' },
] as const;

// Group tests by category for easier rendering
export const getTestsByCategory = () => {
  return LAB_TEST_CATEGORIES.map(category => ({
    ...category,
    tests: LAB_TEST_ITEMS.filter(test => test.category === category.key)
  }));
};
