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

    // If bloodChemistry results are provided, validate each result field
    for (const [resultField, requestField] of Object.entries(bloodChemistryTests)) {
      if (results[resultField] !== undefined) {
        // Check if the corresponding test was requested in bloodChemistry category
        if (!requestedTests.tests || !requestedTests.tests.bloodChemistry || !requestedTests.tests.bloodChemistry[requestField]) {
          throw new Error(`Blood chemistry result '${resultField}' provided but test '${requestField}' was not requested`);
        }
      }
    }

    // Check if all requested blood chemistry tests have corresponding result values
    for (const requestedTest of requestedBloodChemistryTests) {
      const resultFieldMap = Object.fromEntries(
        Object.entries(bloodChemistryTests).map(([resultField, requestField]) => [requestField, resultField])
      );
      
      const resultField = resultFieldMap[requestedTest];
      if (resultField && (results[resultField] === undefined || results[resultField] === null)) {
        throw new Error(`Blood chemistry test '${requestedTest}' was requested but no result value provided for '${resultField}'`);
      }
      
      // Special case for lipidProfile - any lipid result satisfies the lipidProfile request
      if (requestedTest === 'lipidProfile') {
        const lipidFields = ['cholesterol', 'triglycerides', 'hdl', 'ldl', 'vldl'];
        const hasAnyLipidResult = lipidFields.some(field => 
          results[field] !== undefined && results[field] !== null
        );
        if (!hasAnyLipidResult) {
          throw new Error(`Blood chemistry test 'lipidProfile' was requested but no lipid profile results provided`);
        }
      }
    }
  }

  /**
   * Validates urinalysis results against requested tests
   */
  private validateUrinalysisResults(results: any, requestedTests: any): void {
    // Check if urinalysis was requested in routine category
    if (!requestedTests.tests || !requestedTests.tests.routine || !requestedTests.tests.routine.urinalysis) {
      throw new Error('Urinalysis results provided but urinalysis test was not requested');
    }

    // Validate that urinalysis results contain actual values
    const urinalysisValues = Object.values(results);
    const hasUrinalysisValues = urinalysisValues.some(value => value !== undefined && value !== null && value !== '');
    if (!hasUrinalysisValues) {
      throw new Error('Urinalysis test was requested but no result values provided');
    }

    // Validate pregnancy test specifically
    if (results.pregnancyTest !== undefined) {
      if (!requestedTests.tests || !requestedTests.tests.routine || !requestedTests.tests.routine.pregnancyTest) {
        throw new Error('Pregnancy test result provided but pregnancy test was not requested');
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

    // Validate that hematology results contain actual values
    const hematologyValues = Object.values(results);
    const hasHematologyValues = hematologyValues.some(value => value !== undefined && value !== null && value !== '');
    if (!hasHematologyValues) {
      throw new Error('Hematology test was requested but no result values provided');
    }
  }

  /**
   * Validates fecalysis results against requested tests
   */
  private validateFecalysisResults(results: any, requestedTests: any): void {
    // Check if fecalysis was requested in routine category
    if (!requestedTests.tests || !requestedTests.tests.routine || !requestedTests.tests.routine.fecalysis) {
      throw new Error('Fecalysis results provided but fecalysis test was not requested');
    }

    // Validate that fecalysis results contain actual values
    const fecalysisValues = Object.values(results);
    const hasFecalysisValues = fecalysisValues.some(value => value !== undefined && value !== null && value !== '');
    if (!hasFecalysisValues) {
      throw new Error('Fecalysis test was requested but no result values provided');
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
   * Validates ECG results against requested tests
   */
  private validateEcgResults(results: any, requestedTests: any): void {
    // Check if ECG was requested in miscellaneous category
    if (!requestedTests.tests || !requestedTests.tests.miscellaneous || !requestedTests.tests.miscellaneous.ecg) {
      throw new Error('ECG results provided but ECG test was not requested');
    }

    // Validate that ECG results contain actual values
    const ecgValues = Object.values(results);
    const hasEcgValues = ecgValues.some(value => value !== undefined && value !== null && value !== '');
    if (!hasEcgValues) {
      throw new Error('ECG test was requested but no result values provided');
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