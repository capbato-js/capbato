export interface LabTestData {
  routine: {
    cbcWithPlatelet: boolean;
    pregnancyTest: boolean;
    urinalysis: boolean;
    fecalysis: boolean;
    occultBloodTest: boolean;
  };
  
  serology: {
    hepatitisBScreening: boolean;
    hepatitisAScreening: boolean;
    hepatitisCScreening: boolean;
    hepatitisProfile: boolean;
    vdrlRpr: boolean;
    crp: boolean;
    dengueNs1: boolean;
    aso: boolean;
    crf: boolean;
    raRf: boolean;
    tumorMarkers: boolean;
    ca125: boolean;
    cea: boolean;
    psa: boolean;
    betaHcg: boolean;
  };
  
  bloodChemistry: {
    fbs: boolean;
    bun: boolean;
    creatinine: boolean;
    bloodUricAcid: boolean;
    lipidProfile: boolean;
    sgot: boolean;
    sgpt: boolean;
    alkalinePhosphatase: boolean;
    sodium: boolean;
    potassium: boolean;
    hba1c: boolean;
  };
  
  miscellaneous: {
    ecg: boolean;
  };
  
  thyroid: {
    t3: boolean;
    t4: boolean;
    ft3: boolean;
    ft4: boolean;
    tsh: boolean;
  };

  coagulation: {
    ptPtt: boolean;
    pt: boolean;
    ptt: boolean;
    inr: boolean;
  };
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
    // Check if at least one test is selected across all categories
    const hasAnyTest =
      Object.values(this._tests.routine).some(v => v === true) ||
      Object.values(this._tests.serology).some(v => v === true) ||
      Object.values(this._tests.bloodChemistry).some(v => v === true) ||
      Object.values(this._tests.miscellaneous).some(v => v === true) ||
      Object.values(this._tests.thyroid).some(v => v === true) ||
      Object.values(this._tests.coagulation).some(v => v === true);

    if (!hasAnyTest) {
      throw new Error('At least one laboratory test must be selected');
    }
  }

  equals(other: LabRequestTests): boolean {
    const thisTests = this._tests;
    const otherTests = other._tests;

    // Deep compare all categories
    return (
      JSON.stringify(thisTests.routine) === JSON.stringify(otherTests.routine) &&
      JSON.stringify(thisTests.serology) === JSON.stringify(otherTests.serology) &&
      JSON.stringify(thisTests.bloodChemistry) === JSON.stringify(otherTests.bloodChemistry) &&
      JSON.stringify(thisTests.miscellaneous) === JSON.stringify(otherTests.miscellaneous) &&
      JSON.stringify(thisTests.thyroid) === JSON.stringify(otherTests.thyroid) &&
      JSON.stringify(thisTests.coagulation) === JSON.stringify(otherTests.coagulation)
    );
  }

  getSelectedTests(): string[] {
    const selectedTests: string[] = [];
    
    // Routine Tests
    const routineTestMap = {
      cbcWithPlatelet: 'CBC with Platelet',
      pregnancyTest: 'Pregnancy Test',
      urinalysis: 'Urinalysis',
      fecalysis: 'Fecalysis',
      occultBloodTest: 'Occult Blood Test',
    };
    
    for (const [key, displayName] of Object.entries(routineTestMap)) {
      if (this._tests.routine[key as keyof typeof this._tests.routine]) {
        selectedTests.push(displayName);
      }
    }
    
    // Serology Tests
    const serologyTestMap = {
      hepatitisBScreening: 'Hepatitis B Screening',
      hepatitisAScreening: 'Hepatitis A Screening',
      hepatitisCScreening: 'Hepatitis C Screening',
      hepatitisProfile: 'Hepatitis Profile',
      vdrlRpr: 'VDRL/RPR',
      crp: 'CRP',
      dengueNs1: 'Dengue NS1',
      aso: 'ASO',
      crf: 'CRF',
      raRf: 'RA/RF',
      tumorMarkers: 'Tumor Markers',
      ca125: 'CA 125',
      cea: 'CEA',
      psa: 'PSA',
      betaHcg: 'Beta HCG',
    };
    
    for (const [key, displayName] of Object.entries(serologyTestMap)) {
      if (this._tests.serology[key as keyof typeof this._tests.serology]) {
        selectedTests.push(displayName);
      }
    }
    
    // Blood Chemistry Tests
    const bloodChemistryTestMap = {
      fbs: 'FBS',
      bun: 'BUN',
      creatinine: 'Creatinine',
      bloodUricAcid: 'Blood Uric Acid',
      lipidProfile: 'Lipid Profile',
      sgot: 'SGOT',
      sgpt: 'SGPT',
      alkalinePhosphatase: 'Alkaline Phosphatase',
      sodium: 'Sodium',
      potassium: 'Potassium',
      hba1c: 'HBA1C',
    };
    
    for (const [key, displayName] of Object.entries(bloodChemistryTestMap)) {
      if (this._tests.bloodChemistry[key as keyof typeof this._tests.bloodChemistry]) {
        selectedTests.push(displayName);
      }
    }
    
    // Miscellaneous Tests
    const miscTestMap = {
      ecg: 'ECG',
    };
    
    for (const [key, displayName] of Object.entries(miscTestMap)) {
      if (this._tests.miscellaneous[key as keyof typeof this._tests.miscellaneous]) {
        selectedTests.push(displayName);
      }
    }
    
    // Thyroid Tests
    const thyroidTestMap = {
      t3: 'T3',
      t4: 'T4',
      ft3: 'FT3',
      ft4: 'FT4',
      tsh: 'TSH',
    };

    for (const [key, displayName] of Object.entries(thyroidTestMap)) {
      if (this._tests.thyroid[key as keyof typeof this._tests.thyroid]) {
        selectedTests.push(displayName);
      }
    }

    // Coagulation Tests
    const coagulationTestMap = {
      ptPtt: 'PT/PTT',
      pt: 'PT',
      ptt: 'PTT',
      inr: 'INR',
    };

    for (const [key, displayName] of Object.entries(coagulationTestMap)) {
      if (this._tests.coagulation[key as keyof typeof this._tests.coagulation]) {
        selectedTests.push(displayName);
      }
    }

    return selectedTests;
  }

  hasResults(): boolean {
    // Check if any blood chemistry tests are selected (as they typically have results)
    return Object.values(this._tests.bloodChemistry).some(v => v === true);
  }

  updateResults(updatedTests: Partial<LabTestData>): LabRequestTests {
    const mergedTests: LabTestData = {
      routine: { ...this._tests.routine, ...updatedTests.routine },
      serology: { ...this._tests.serology, ...updatedTests.serology },
      bloodChemistry: { ...this._tests.bloodChemistry, ...updatedTests.bloodChemistry },
      miscellaneous: { ...this._tests.miscellaneous, ...updatedTests.miscellaneous },
      thyroid: { ...this._tests.thyroid, ...updatedTests.thyroid },
      coagulation: { ...this._tests.coagulation, ...updatedTests.coagulation },
    };

    return new LabRequestTests(mergedTests);
  }
}
