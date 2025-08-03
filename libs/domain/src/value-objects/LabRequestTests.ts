export interface LabTestData {
  // Basic Tests
  cbcWithPlatelet?: string;
  pregnancyTest?: string;
  urinalysis?: string;
  fecalysis?: string;
  occultBloodTest?: string;
  
  // Hepatitis Tests
  hepaBScreening?: string;
  hepaAScreening?: string;
  hepatitisProfile?: string;
  
  // STD Tests
  vdrlRpr?: string;
  
  // Other Tests
  dengueNs1?: string;
  ca125CeaPsa?: string;
  
  // Blood Chemistry (Results)
  fbs?: string;
  bun?: string;
  creatinine?: string;
  bloodUricAcid?: string;
  lipidProfile?: string;
  sgot?: string;
  sgpt?: string;
  alp?: string;
  sodiumNa?: string;
  potassiumK?: string;
  hbalc?: string;
  
  // Other Tests
  ecg?: string;
  t3?: string;
  t4?: string;
  ft3?: string;
  ft4?: string;
  tsh?: string;
}

export class LabRequestTests {
  private readonly _tests: LabTestData;

  constructor(tests: LabTestData) {
    this._tests = { ...tests };
    this.validate();
  }

  static create(tests: LabTestData): LabRequestTests {
    return new LabRequestTests(tests);
  }

  get tests(): LabTestData {
    return { ...this._tests };
  }

  validate(): void {
    // Check if at least one test is selected
    const hasAnyTest = Object.values(this._tests).some(
      value => value && value.toString().toLowerCase() !== 'no' && value.toString().trim() !== ''
    );
    
    if (!hasAnyTest) {
      throw new Error('At least one laboratory test must be selected');
    }
  }

  equals(other: LabRequestTests): boolean {
    const thisTests = this._tests;
    const otherTests = other._tests;
    
    // Compare all properties
    const allKeys = new Set([...Object.keys(thisTests), ...Object.keys(otherTests)]);
    
    for (const key of allKeys) {
      if (thisTests[key as keyof LabTestData] !== otherTests[key as keyof LabTestData]) {
        return false;
      }
    }
    
    return true;
  }

  getSelectedTests(): string[] {
    const testNameMap: Record<keyof LabTestData, string> = {
      cbcWithPlatelet: 'CBC with Platelet',
      pregnancyTest: 'Pregnancy Test',
      urinalysis: 'Urinalysis',
      fecalysis: 'Fecalysis',
      occultBloodTest: 'Occult Blood Test',
      hepaBScreening: 'Hepa B Screening',
      hepaAScreening: 'Hepa A Screening',
      hepatitisProfile: 'Hepatitis Profile',
      vdrlRpr: 'VDRL/RPR',
      dengueNs1: 'Dengue NS1',
      ca125CeaPsa: 'CA 125 / CEA / PSA',
      fbs: 'FBS',
      bun: 'BUN',
      creatinine: 'Creatinine',
      bloodUricAcid: 'Blood Uric Acid',
      lipidProfile: 'Lipid Profile',
      sgot: 'SGOT',
      sgpt: 'SGPT',
      alp: 'ALP',
      sodiumNa: 'Sodium Na',
      potassiumK: 'Potassium K+',
      hbalc: 'HBA1C',
      ecg: 'ECG',
      t3: 'T3',
      t4: 'T4',
      ft3: 'FT3',
      ft4: 'FT4',
      tsh: 'TSH'
    };

    const selectedTests: string[] = [];
    
    Object.entries(this._tests).forEach(([key, value]) => {
      if (value && value.toString().toLowerCase() !== 'no' && value.toString().trim() !== '') {
        const testName = testNameMap[key as keyof LabTestData];
        if (testName) {
          selectedTests.push(testName);
        }
      }
    });
    
    return selectedTests;
  }

  hasResults(): boolean {
    const resultFields = [
      'fbs', 'bun', 'creatinine', 'bloodUricAcid', 'lipidProfile',
      'sgot', 'sgpt', 'alp', 'sodiumNa', 'potassiumK', 'hbalc'
    ];
    
    return resultFields.some(field => {
      const value = this._tests[field as keyof LabTestData];
      return value && value.toString().trim() !== '';
    });
  }

  updateResults(results: Partial<LabTestData>): LabRequestTests {
    return new LabRequestTests({
      ...this._tests,
      ...results
    });
  }
}
