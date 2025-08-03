export interface BloodChemistryResultData {
  // Basic Chemistry
  fbs?: number;
  bun?: number;
  creatinine?: number;
  uricAcid?: number;
  
  // Lipid Profile
  cholesterol?: number;
  triglycerides?: number;
  hdl?: number;
  ldl?: number;
  vldl?: number;
  
  // Electrolytes
  sodium?: number;
  potassium?: number;
  chloride?: number;
  calcium?: number;
  ionisedCalcium?: number;
  magnesium?: number;
  inorPhosphorus?: number;
  
  // Liver Function
  sgot?: number;
  sgpt?: number;
  alkPhosphatase?: number;
  totalProtein?: number;
  albumin?: number;
  globulin?: number;
  agRatio?: number;
  totalBilirubin?: number;
  directBilirubin?: number;
  indirectBilirubin?: number;
  
  // Other Tests
  rbs?: number;
  hbalc?: number;
  ogtt30min?: number;
  ogtt1hr?: number;
  ogtt2hr?: number;
  ppbs2hr?: number;
}

export class BloodChemistryResults {
  private readonly _results: BloodChemistryResultData;

  constructor(results: BloodChemistryResultData) {
    this._results = { ...results };
    this.validate();
  }

  get results(): BloodChemistryResultData {
    return { ...this._results };
  }

  validate(): void {
    // Check if at least one result is provided
    const hasAnyResult = Object.values(this._results).some(
      value => value !== undefined && value !== null && !isNaN(Number(value))
    );
    
    if (!hasAnyResult) {
      throw new Error('At least one blood chemistry result must be provided');
    }

    // Validate numeric ranges for critical values
    this.validateNumericRanges();
  }

  private validateNumericRanges(): void {
    const { fbs, bun, creatinine, cholesterol, triglycerides, sgot, sgpt } = this._results;

    // Validate FBS (Fasting Blood Sugar) - normal range: 70-100 mg/dL
    if (fbs !== undefined && (fbs < 0 || fbs > 1000)) {
      throw new Error('FBS value must be between 0 and 1000 mg/dL');
    }

    // Validate BUN (Blood Urea Nitrogen) - normal range: 7-20 mg/dL
    if (bun !== undefined && (bun < 0 || bun > 200)) {
      throw new Error('BUN value must be between 0 and 200 mg/dL');
    }

    // Validate Creatinine - normal range: 0.6-1.2 mg/dL
    if (creatinine !== undefined && (creatinine < 0 || creatinine > 50)) {
      throw new Error('Creatinine value must be between 0 and 50 mg/dL');
    }

    // Validate Cholesterol - normal range: <200 mg/dL
    if (cholesterol !== undefined && (cholesterol < 0 || cholesterol > 1000)) {
      throw new Error('Cholesterol value must be between 0 and 1000 mg/dL');
    }

    // Validate Triglycerides - normal range: <150 mg/dL
    if (triglycerides !== undefined && (triglycerides < 0 || triglycerides > 2000)) {
      throw new Error('Triglycerides value must be between 0 and 2000 mg/dL');
    }

    // Validate SGOT/SGPT - normal range: 5-40 U/L
    if (sgot !== undefined && (sgot < 0 || sgot > 500)) {
      throw new Error('SGOT value must be between 0 and 500 U/L');
    }

    if (sgpt !== undefined && (sgpt < 0 || sgpt > 500)) {
      throw new Error('SGPT value must be between 0 and 500 U/L');
    }
  }

  equals(other: BloodChemistryResults): boolean {
    const thisResults = this._results;
    const otherResults = other._results;
    
    // Compare all properties
    const allKeys = new Set([...Object.keys(thisResults), ...Object.keys(otherResults)]);
    
    for (const key of allKeys) {
      if (thisResults[key as keyof BloodChemistryResultData] !== otherResults[key as keyof BloodChemistryResultData]) {
        return false;
      }
    }
    
    return true;
  }

  hasAbnormalValues(): boolean {
    const { fbs, bun, creatinine, cholesterol, triglycerides, sgot, sgpt, hdl, ldl } = this._results;

    // Check for abnormal values based on standard ranges
    if (fbs && (fbs < 70 || fbs > 100)) return true;
    if (bun && (bun < 7 || bun > 20)) return true;
    if (creatinine && (creatinine < 0.6 || creatinine > 1.2)) return true;
    if (cholesterol && cholesterol > 200) return true;
    if (triglycerides && triglycerides > 150) return true;
    if (sgot && (sgot < 5 || sgot > 40)) return true;
    if (sgpt && (sgpt < 5 || sgpt > 40)) return true;
    if (hdl && hdl < 40) return true; // HDL should be >40 for men, >50 for women
    if (ldl && ldl > 100) return true;

    return false;
  }

  getCriticalValues(): string[] {
    const criticalValues: string[] = [];
    const { fbs, bun, creatinine, sgot, sgpt } = this._results;

    if (fbs && fbs > 200) criticalValues.push(`Critically high FBS: ${fbs} mg/dL`);
    if (bun && bun > 50) criticalValues.push(`Critically high BUN: ${bun} mg/dL`);
    if (creatinine && creatinine > 3.0) criticalValues.push(`Critically high Creatinine: ${creatinine} mg/dL`);
    if (sgot && sgot > 100) criticalValues.push(`Critically high SGOT: ${sgot} U/L`);
    if (sgpt && sgpt > 100) criticalValues.push(`Critically high SGPT: ${sgpt} U/L`);

    return criticalValues;
  }

  updateResults(updates: Partial<BloodChemistryResultData>): BloodChemistryResults {
    return new BloodChemistryResults({
      ...this._results,
      ...updates
    });
  }
}
