import { injectable, inject } from 'tsyringe';
import { LabTestResult } from '@nx-starter/domain';
import { ILabTestResultRepository, ILabRequestRepository } from '@nx-starter/domain';
import { TOKENS } from '../../di/tokens';
import { CreateLabTestResultCommand } from '../../validation/LaboratoryValidationSchemas';
import { generateDashlessUuid } from '../../utils/uuid';

/**
 * Use case for creating lab test results
 * Implements the business logic for creating test results and updating lab request status
 */
@injectable()
export class CreateLabTestResultUseCase {
  constructor(
    @inject(TOKENS.LabTestResultRepository)
    private labTestResultRepository: ILabTestResultRepository,
    @inject(TOKENS.LabRequestRepository)
    private labRequestRepository: ILabRequestRepository
  ) {}

  async execute(command: CreateLabTestResultCommand): Promise<LabTestResult> {
    // 1. Validate lab request exists
    const labRequest = await this.labRequestRepository.getById(command.labRequestId);
    if (!labRequest) {
      throw new Error(`Lab request with ID ${command.labRequestId} not found`);
    }

    // 2. Get patient ID from the lab request
    const patientId = labRequest.patientInfo.patientId;

    // 3. Check if lab request is in pending status
    if (!labRequest.isPending()) {
      throw new Error(`Lab request ${command.labRequestId} is not in pending status. Current status: ${labRequest.status.value}`);
    }

    // 4. Validate results against requested tests
    this.validateResultsAgainstRequest(command, labRequest);

    // 5. Create the lab test result entity
    const labTestResult = new LabTestResult(
      command.labRequestId,
      patientId,
      new Date(command.dateTested),
      command.bloodChemistry,
      command.urinalysis,
      command.hematology,
      command.fecalysis,
      command.serology,
      command.dengue,
      command.ecg,
      command.coagulation,
      command.remarks,
      generateDashlessUuid()
    );

    // 6. Validate the entity
    labTestResult.validate();

    // 7. Check if a result already exists for this lab request
    const existingResult = await this.labTestResultRepository.getByLabRequestId(command.labRequestId);
    if (existingResult) {
      throw new Error(`Lab test result already exists for lab request ${command.labRequestId}`);
    }

    // 8. Save the lab test result
    const savedResult = await this.labTestResultRepository.create(labTestResult);

    // 9. Update lab request status to completed
    const completedLabRequest = labRequest.complete(new Date(command.dateTested));
    await this.labRequestRepository.update(completedLabRequest);

    return savedResult;
  }

  /**
   * Validates that the provided results match the originally requested tests
   */
  private validateResultsAgainstRequest(command: CreateLabTestResultCommand, labRequest: any): void {
    const requestedTests = labRequest.tests;
    const providedResults = command;

    // Validate blood chemistry results
    if (providedResults.bloodChemistry) {
      this.validateBloodChemistryResults(providedResults.bloodChemistry, requestedTests);
    }

    // Validate urinalysis results
    if (providedResults.urinalysis) {
      this.validateUrinalysisResults(providedResults.urinalysis, requestedTests);
    }

    // Validate hematology results
    if (providedResults.hematology) {
      this.validateHematologyResults(providedResults.hematology, requestedTests);
    }

    // Validate fecalysis results
    if (providedResults.fecalysis) {
      this.validateFecalysisResults(providedResults.fecalysis, requestedTests);
    }

    // Validate serology results
    if (providedResults.serology) {
      this.validateSerologyResults(providedResults.serology, requestedTests);
    }

    // Validate dengue results
    if (providedResults.dengue) {
      this.validateDengueResults(providedResults.dengue, requestedTests);
    }

    // Validate ECG results
    if (providedResults.ecg) {
      this.validateEcgResults(providedResults.ecg, requestedTests);
    }

    // Validate coagulation results
    if (providedResults.coagulation) {
      this.validateCoagulationResults(providedResults.coagulation, requestedTests);
    }
  }

  /**
   * Validates blood chemistry results against requested tests
   */
  private validateBloodChemistryResults(results: any, requestedTests: any): void {
    const bloodChemistryTests = {
      fbs: 'fbs',
      bun: 'bun', 
      creatinine: 'creatinine',
      uricAcid: 'bloodUricAcid',
      cholesterol: 'lipidProfile',
      triglycerides: 'lipidProfile',
      hdl: 'lipidProfile',
      ldl: 'lipidProfile',
      vldl: 'lipidProfile',
      sodium: 'sodium',
      potassium: 'potassium',
      sgot: 'sgot',
      sgpt: 'sgpt',
      alkPhosphatase: 'alkalinePhosphatase',
      hba1c: 'hba1c'
    };

    // Track which tests were requested
    const requestedBloodChemistryTests: string[] = [];
    if (requestedTests.tests && requestedTests.tests.bloodChemistry) {
      for (const [testKey, isRequested] of Object.entries(requestedTests.tests.bloodChemistry)) {
        if (isRequested === true) {
          requestedBloodChemistryTests.push(testKey);
        }
      }
    }

    // Special handling for lipid profile first
    const lipidFields = ['cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl'];
    const hasLipidProfileRequest = requestedBloodChemistryTests.includes('lipidProfile');
    const providedLipidFields = lipidFields.filter(field => 
      results[field] !== undefined && results[field] !== null
    );

    // If lipidProfile was requested, validate that ALL 5 lipid results are provided
    if (hasLipidProfileRequest) {
      const missingLipidFields = lipidFields.filter(field => 
        results[field] === undefined || results[field] === null
      );
      
      if (missingLipidFields.length > 0) {
        throw new Error(`Blood chemistry test 'lipidProfile' was requested but missing values for: ${missingLipidFields.join(', ')}`);
      }
    }

    // If lipid results are provided, ensure lipidProfile was requested
    if (providedLipidFields.length > 0 && !hasLipidProfileRequest) {
      throw new Error(`Lipid profile results provided but test 'lipidProfile' was not requested`);
    }

    // Validate non-lipid blood chemistry tests
    for (const [resultField, requestField] of Object.entries(bloodChemistryTests)) {
      // Skip lipid fields - they are handled above
      if (lipidFields.includes(resultField)) {
        continue;
      }

      if (results[resultField] !== undefined) {
        // Check if the corresponding test was requested in bloodChemistry category
        if (!requestedTests.tests || !requestedTests.tests.bloodChemistry || !requestedTests.tests.bloodChemistry[requestField]) {
          throw new Error(`Blood chemistry result '${resultField}' provided but test '${requestField}' was not requested`);
        }
      }
    }

    // Check if all requested non-lipid blood chemistry tests have corresponding result values
    for (const requestedTest of requestedBloodChemistryTests) {
      // Skip lipidProfile - it's handled above
      if (requestedTest === 'lipidProfile') {
        continue;
      }

      const resultFieldMap = Object.fromEntries(
        Object.entries(bloodChemistryTests).map(([resultField, requestField]) => [requestField, resultField])
      );
      
      const resultField = resultFieldMap[requestedTest];
      if (resultField && (results[resultField] === undefined || results[resultField] === null)) {
        throw new Error(`Blood chemistry test '${requestedTest}' was requested but no result value provided for '${resultField}'`);
      }
    }
  }

  /**
   * Validates urinalysis results against requested tests
   */
  private validateUrinalysisResults(results: any, requestedTests: any): void {
    // Define urinalysis fields (excluding pregnancy test and others which is optional)
    const regularUrinalysisFields = [
      'color', 'transparency', 'specificGravity', 'ph', 'protein', 'glucose',
      'epithelialCells', 'redCells', 'pusCells', 'mucusThread', 'amorphousUrates',
      'amorphousPhosphate', 'crystals', 'bacteria'
    ];
    
    const hasUrinalysisRequest = requestedTests.tests?.routine?.urinalysis;
    const hasPregnancyTestRequest = requestedTests.tests?.routine?.pregnancyTest;
    
    // Check what results are provided
    const providedRegularFields = regularUrinalysisFields.filter(field => 
      results[field] !== undefined && results[field] !== null
    );
    const hasPregnancyTestResult = results.pregnancyTest !== undefined && results.pregnancyTest !== null;

    // Validation logic
    if (hasPregnancyTestRequest && hasUrinalysisRequest) {
      throw new Error('Cannot request both pregnancy test and regular urinalysis in the same request');
    }
    
    if (hasPregnancyTestRequest) {
      // Pregnancy test scenario: ONLY pregnancy test should be provided
      if (providedRegularFields.length > 0) {
        throw new Error(`Pregnancy test was requested but regular urinalysis results provided: ${providedRegularFields.join(', ')}`);
      }
      if (!hasPregnancyTestResult) {
        throw new Error('Pregnancy test was requested but no pregnancy test result provided');
      }
    } else if (hasUrinalysisRequest) {
      // Regular urinalysis scenario: ALL regular fields must be provided
      const missingFields = regularUrinalysisFields.filter(field => 
        results[field] === undefined || results[field] === null
      );
      
      if (missingFields.length > 0) {
        throw new Error(`Urinalysis test was requested but missing values for: ${missingFields.join(', ')}`);
      }
      
      if (hasPregnancyTestResult) {
        throw new Error('Regular urinalysis was requested but pregnancy test result provided. Use separate pregnancy test request.');
      }
    } else {
      // No urinalysis or pregnancy test requested
      if (providedRegularFields.length > 0 || hasPregnancyTestResult) {
        throw new Error('Urinalysis results provided but no urinalysis or pregnancy test was requested');
      }
    }
  }

  /**
   * Validates hematology results against requested tests
   */
  private validateHematologyResults(results: any, requestedTests: any): void {
    // Check if CBC with platelet was requested in routine category
    if (!requestedTests.tests || !requestedTests.tests.routine || !requestedTests.tests.routine.cbcWithPlatelet) {
      throw new Error('Hematology results provided but CBC with platelet test was not requested');
    }

    // Define required hematology/CBC fields ('others' is optional)
    const requiredHematologyFields = [
      'hematocrit', 'hemoglobin', 'rbc', 'wbc', 'segmenters', 
      'lymphocyte', 'monocyte', 'basophils', 'eosinophils', 'platelet'
    ];

    // Check for missing required fields
    const missingFields = requiredHematologyFields.filter(field => 
      results[field] === undefined || results[field] === null
    );

    if (missingFields.length > 0) {
      throw new Error(`CBC with platelet test was requested but missing values for: ${missingFields.join(', ')}`);
    }
  }

  /**
   * Validates fecalysis results against requested tests
   */
  private validateFecalysisResults(results: any, requestedTests: any): void {
    // Define fecalysis fields (excluding occult blood - it's a separate test)
    // 'others' is optional and not required for validation
    const regularFecalysisFields = [
      'color', 'consistency', 'rbc', 'wbc', 'urobilinogen'
    ];
    
    const hasFecalysisRequest = requestedTests.tests?.routine?.fecalysis;
    const hasOccultBloodRequest = requestedTests.tests?.routine?.occultBloodTest;
    
    // Check what results are provided
    const providedRegularFields = regularFecalysisFields.filter(field => 
      results[field] !== undefined && results[field] !== null
    );
    const hasOccultBloodResult = results.occultBlood !== undefined && results.occultBlood !== null;

    // Validation logic
    if (hasOccultBloodRequest && hasFecalysisRequest) {
      throw new Error('Cannot request both occult blood test and regular fecalysis in the same request');
    }
    
    if (hasOccultBloodRequest) {
      // Occult blood test scenario: ONLY occult blood should be provided
      if (providedRegularFields.length > 0) {
        throw new Error(`Occult blood test was requested but regular fecalysis results provided: ${providedRegularFields.join(', ')}`);
      }
      if (!hasOccultBloodResult) {
        throw new Error('Occult blood test was requested but no occult blood result provided');
      }
    } else if (hasFecalysisRequest) {
      // Regular fecalysis scenario: ALL fecalysis fields must be provided (excluding occult blood)
      const missingFields = regularFecalysisFields.filter(field => 
        results[field] === undefined || results[field] === null
      );
      
      if (missingFields.length > 0) {
        throw new Error(`Fecalysis test was requested but missing values for: ${missingFields.join(', ')}`);
      }
      
      if (hasOccultBloodResult) {
        throw new Error('Regular fecalysis was requested but occult blood result provided. Use separate occult blood test request.');
      }
    } else {
      // No fecalysis or occult blood test requested
      if (providedRegularFields.length > 0 || hasOccultBloodResult) {
        throw new Error('Fecalysis results provided but no fecalysis or occult blood test was requested');
      }
    }
  }

  /**
   * Validates serology results against requested tests
   */
  private validateSerologyResults(results: any, requestedTests: any): void {
    const serologyTests = {
      ft3: 'ft3',
      ft4: 'ft4',
      tsh: 'tsh',
      dengueIgg: 'dengueNs1', // Map dengue IgG to dengue NS1 request
      dengueIgm: 'dengueNs1', // Map dengue IgM to dengue NS1 request
      dengueNs1: 'dengueNs1'
    };

    // Check if any serology or thyroid tests were requested
    const hasSerologyRequest = requestedTests.tests && (
      (requestedTests.tests.serology && Object.values(requestedTests.tests.serology).some((v: any) => v === true)) ||
      (requestedTests.tests.thyroid && Object.values(requestedTests.tests.thyroid).some((v: any) => v === true))
    );

    if (!hasSerologyRequest) {
      throw new Error('Serology results provided but no serology or thyroid tests were requested');
    }

    // Validate that serology results contain actual values
    const serologyValues = Object.values(results);
    const hasSerologyValues = serologyValues.some(value => value !== undefined && value !== null && value !== '');
    if (!hasSerologyValues) {
      throw new Error('Serology tests were requested but no result values provided');
    }
  }

  /**
   * Validates dengue results against requested tests
   */
  private validateDengueResults(results: any, requestedTests: any): void {
    // Check if dengue test was requested in serology category
    if (!requestedTests.tests || !requestedTests.tests.serology || !requestedTests.tests.serology.dengueNs1) {
      throw new Error('Dengue results provided but dengue test was not requested');
    }

    // Validate that dengue results contain actual values
    const dengueValues = Object.values(results);
    const hasDengueValues = dengueValues.some(value => value !== undefined && value !== null && value !== '');
    if (!hasDengueValues) {
      throw new Error('Dengue test was requested but no result values provided');
    }
  }

  /**
   * Validates ECG results against requested tests
   */
  private validateEcgResults(results: any, requestedTests: any): void {
    // Check if ECG was requested in miscellaneous category
    if (!requestedTests.tests || !requestedTests.tests.miscellaneous || !requestedTests.tests.miscellaneous.ecg) {
      throw new Error('ECG results provided but ECG test was not requested');
    }

    // Define required ECG fields ('others', 'interpretation', 'interpreter' are optional)
    const requiredEcgFields = [
      'av', 'qrs', 'axis', 'pr', 'qt', 'stT', 'rhythm'
    ];

    // Check for missing required fields
    const missingFields = requiredEcgFields.filter(field => 
      results[field] === undefined || results[field] === null
    );

    if (missingFields.length > 0) {
      throw new Error(`ECG test was requested but missing values for: ${missingFields.join(', ')}`);
    }
  }

  /**
   * Validates coagulation results against requested tests
   */
  private validateCoagulationResults(results: any, requestedTests: any): void {
    // Note: Coagulation tests are not yet defined in the LabRequestTests schema
    // For now, we'll allow coagulation results without strict validation
    
    // Validate that coagulation results contain actual values
    const coagulationValues = Object.values(results);
    const hasCoagulationValues = coagulationValues.some(value => value !== undefined && value !== null && value !== '');
    if (!hasCoagulationValues) {
      throw new Error('Coagulation results provided but no result values found');
    }
  }
}