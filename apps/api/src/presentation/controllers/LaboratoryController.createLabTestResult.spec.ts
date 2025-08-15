import { describe, it, expect, beforeEach } from 'vitest';
import { LaboratoryController } from './LaboratoryController';

describe('LaboratoryController - createLabTestResult', () => {
  let controller: LaboratoryController;
  let mockCreateLabTestResultUseCase: any;
  let mockValidationService: any;

  beforeEach(() => {
    // Mock dependencies
    mockCreateLabTestResultUseCase = {
      execute: async (command: any) => ({
        id: 'abc123def456ghi789jkl012mno345pqr',
        labRequestId: command.labRequestId,
        patientId: 'f5768246f4a64410a2a845a4a618f07e', // This comes from lab request, not command
        dateTested: new Date(command.dateTested),
        bloodChemistry: command.bloodChemistry,
        urinalysis: command.urinalysis,
        remarks: command.remarks,
        createdAt: new Date(),
      })
    };

    mockValidationService = {
      validateCreateLabTestResultCommand: (data: any) => data
    };

    // Create controller with mocked dependencies (simplified for test)
    controller = new LaboratoryController(
      null as any, // createLabRequestUseCase
      null as any, // updateLabRequestResultsUseCase  
      null as any, // createBloodChemistryUseCase
      mockCreateLabTestResultUseCase,
      null as any, // getAllLabRequestsQueryHandler
      null as any, // getCompletedLabRequestsQueryHandler
      null as any, // getLabRequestByPatientIdQueryHandler
      mockValidationService,
      // ... other mocked dependencies
      null as any, null as any, null as any, null as any, null as any, null as any,
      null as any, null as any, null as any, null as any, null as any, null as any,
      null as any, null as any, null as any, null as any, null as any, null as any,
      null as any, null as any, null as any, null as any, null as any, null as any,
      null as any, null as any, null as any, null as any, null as any, null as any,
      null as any, null as any, null as any, null as any, null as any, null as any,
      null as any, null as any, null as any, null as any
    );
  });

  it('should create lab test result successfully', async () => {
    const requestData = {
      labRequestId: 'd2e66463bb2349209ea2cddf47f7822f',
      dateTested: '2025-08-13T10:30:00.000Z',
      bloodChemistry: {
        fbs: 5.2,
        cholesterol: 4.1,
        triglycerides: 1.2
      },
      urinalysis: {
        color: 'Yellow',
        protein: 'Negative'
      },
      remarks: 'Test completed successfully'
    };

    const response = await controller.createLabTestResult(requestData);

    expect(response.success).toBe(true);
    expect(response.data.id).toBe('abc123def456ghi789jkl012mno345pqr');
    expect(response.data.labRequestId).toBe(requestData.labRequestId);
    expect(response.data.patientId).toBe('f5768246f4a64410a2a845a4a618f07e'); // patientId comes from lab request
    expect(response.data.status).toBe('completed');
    expect(response.data.bloodChemistry).toEqual(requestData.bloodChemistry);
    expect(response.data.urinalysis).toEqual(requestData.urinalysis);
    expect(response.message).toBe('Lab test result created successfully');
  });

  it('should validate request data', async () => {
    const requestData = {
      labRequestId: 'd2e66463bb2349209ea2cddf47f7822f',
      dateTested: '2025-08-13T10:30:00.000Z',
      bloodChemistry: { fbs: 5.2 }
    };

    let validationCalled = false;
    mockValidationService.validateCreateLabTestResultCommand = (data: any) => {
      validationCalled = true;
      expect(data).toEqual(requestData);
      return data;
    };

    await controller.createLabTestResult(requestData);

    expect(validationCalled).toBe(true);
  });

  it('should call use case with validated data', async () => {
    const requestData = {
      labRequestId: 'd2e66463bb2349209ea2cddf47f7822f',
      dateTested: '2025-08-13T10:30:00.000Z',
      urinalysis: { color: 'Yellow', protein: 'Negative' }
    };

    let useCaseCalled = false;
    mockCreateLabTestResultUseCase.execute = async (command: any) => {
      useCaseCalled = true;
      expect(command).toEqual(requestData);
      return {
        id: 'abc123def456ghi789jkl012mno345pqr',
        labRequestId: command.labRequestId,
        patientId: 'f5768246f4a64410a2a845a4a618f07e', // This will come from lab request, not command
        dateTested: new Date(command.dateTested),
        urinalysis: command.urinalysis,
        createdAt: new Date(),
      };
    };

    await controller.createLabTestResult(requestData);

    expect(useCaseCalled).toBe(true);
  });
});