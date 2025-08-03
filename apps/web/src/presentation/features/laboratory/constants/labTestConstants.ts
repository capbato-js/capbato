import { TestCategory } from '../types/FormTypes';

// Lab test constants and mock data based on the legacy form
export interface LabTestItem {
  id: string;
  name: string;
  price: number;
  category: 'ROUTINE' | 'BLOOD_CHEMISTRY' | 'SEROLOGY_IMMUNOLOGY' | 'THYROID_FUNCTION' | 'MISCELLANEOUS';
  fieldName: keyof import('../types/FormTypes').LabRequestFormData['selectedTests'];
}

export const LAB_TEST_ITEMS: LabTestItem[] = [
  // ROUTINE Tests
  { id: 'cbc', name: 'CBC with Platelet', price: 210, category: 'ROUTINE', fieldName: 'cbc_with_platelet' },
  { id: 'pregnancy', name: 'Pregnancy Test', price: 250, category: 'ROUTINE', fieldName: 'pregnancy_test' },
  { id: 'urinalysis', name: 'Urinalysis', price: 80, category: 'ROUTINE', fieldName: 'urinalysis' },
  { id: 'fecalysis', name: 'Fecalysis', price: 80, category: 'ROUTINE', fieldName: 'fecalysis' },
  { id: 'occult_blood', name: 'Occult Blood Test', price: 150, category: 'ROUTINE', fieldName: 'occult_blood_test' },

  // SEROLOGY & IMMUNOLOGY Tests
  { id: 'hepa_b', name: 'Hepa B Screening', price: 250, category: 'SEROLOGY_IMMUNOLOGY', fieldName: 'hepa_b_screening' },
  { id: 'hepa_a', name: 'Hepa A Screening', price: 450, category: 'SEROLOGY_IMMUNOLOGY', fieldName: 'hepa_a_screening' },
  { id: 'hepatitis_profile', name: 'Hepatitis Profile', price: 1100, category: 'SEROLOGY_IMMUNOLOGY', fieldName: 'hepatitis_profile' },
  { id: 'vdrl_rpr', name: 'VDRL/RPR', price: 250, category: 'SEROLOGY_IMMUNOLOGY', fieldName: 'vdrl_rpr' },
  { id: 'dengue_ns1', name: 'Dengue NS1', price: 1200, category: 'SEROLOGY_IMMUNOLOGY', fieldName: 'dengue_ns1' },
  { id: 'ca_markers', name: 'CA 125 / CEA / PSA', price: 1300, category: 'SEROLOGY_IMMUNOLOGY', fieldName: 'ca_125_cea_psa' },

  // BLOOD CHEMISTRY Tests
  { id: 'fbs', name: 'FBS', price: 110, category: 'BLOOD_CHEMISTRY', fieldName: 'fbs' },
  { id: 'bun', name: 'BUN', price: 120, category: 'BLOOD_CHEMISTRY', fieldName: 'bun' },
  { id: 'creatinine', name: 'Creatinine', price: 150, category: 'BLOOD_CHEMISTRY', fieldName: 'creatinine' },
  { id: 'uric_acid', name: 'Blood Uric Acid', price: 120, category: 'BLOOD_CHEMISTRY', fieldName: 'blood_uric_acid' },
  { id: 'lipid_profile', name: 'Lipid Profile', price: 700, category: 'BLOOD_CHEMISTRY', fieldName: 'lipid_profile' },
  { id: 'sgot', name: 'SGOT', price: 200, category: 'BLOOD_CHEMISTRY', fieldName: 'sgot' },
  { id: 'sgpt', name: 'SGPT', price: 200, category: 'BLOOD_CHEMISTRY', fieldName: 'sgpt' },
  { id: 'alp', name: 'ALP', price: 300, category: 'BLOOD_CHEMISTRY', fieldName: 'alp' },
  { id: 'sodium', name: 'Sodium Na', price: 700, category: 'BLOOD_CHEMISTRY', fieldName: 'sodium_na' },
  { id: 'potassium', name: 'Potassium K+', price: 200, category: 'BLOOD_CHEMISTRY', fieldName: 'potassium_k' },
  { id: 'hba1c', name: 'HBA1C', price: 550, category: 'BLOOD_CHEMISTRY', fieldName: 'hbalc' },

  // THYROID FUNCTION Tests
  { id: 't3', name: 'T3', price: 500, category: 'THYROID_FUNCTION', fieldName: 't3' },
  { id: 't4', name: 'T4', price: 500, category: 'THYROID_FUNCTION', fieldName: 't4' },
  { id: 'ft3', name: 'FT3', price: 1000, category: 'THYROID_FUNCTION', fieldName: 'ft3' },
  { id: 'ft4', name: 'FT4', price: 600, category: 'THYROID_FUNCTION', fieldName: 'ft4' },
  { id: 'tsh', name: 'TSH', price: 600, category: 'THYROID_FUNCTION', fieldName: 'tsh' },

  // MISCELLANEOUS Tests
  { id: 'ecg', name: 'ECG', price: 250, category: 'MISCELLANEOUS', fieldName: 'ecg' },
];

export const LAB_TEST_CATEGORIES = [
  { key: 'ROUTINE', label: 'ROUTINE' },
  { key: 'SEROLOGY_IMMUNOLOGY', label: 'SEROLOGY & IMMUNOLOGY' },
  { key: 'BLOOD_CHEMISTRY', label: 'BLOOD CHEMISTRY' },
  { key: 'THYROID_FUNCTION', label: 'THYROID FUNCTION TEST' },
  { key: 'MISCELLANEOUS', label: 'MISCELLANEOUS TEST' },
] as const;

// Group tests by category for easier rendering
export const getTestsByCategory = (): TestCategory[] => {
  return LAB_TEST_CATEGORIES.map(category => ({
    key: category.key,
    label: category.label,
    tests: LAB_TEST_ITEMS
      .filter(test => test.category === category.key)
      .map(test => ({
        key: test.id,
        label: test.name,
        price: test.price,
        fieldName: test.fieldName,
      })),
  }));
};
