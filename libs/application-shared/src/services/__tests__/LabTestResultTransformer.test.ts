import { vi } from 'vitest';
import { LabTestResultTransformer } from '../LabTestResultTransformer';

describe('LabTestResultTransformer', () => {
  const mockLabRequestId = 'test-lab-request-123';
  const mockDate = new Date('2025-08-24T10:30:00.000Z');
  const mockRemarks = 'Test results';

  describe('transformFormDataToApiPayload', () => {
    it('should transform blood chemistry data correctly', () => {
      const formData = {
        fbs: '5.2',
        cholesterol: '200',
        triglycerides: '150',
        hdl: '50',
        ldl: '120',
        others: 'Normal findings'
      };

      const result = LabTestResultTransformer.transformFormDataToApiPayload(
        formData,
        'bloodChemistry',
        mockLabRequestId,
        mockDate,
        mockRemarks
      );

      expect(result).toEqual({
        labRequestId: mockLabRequestId,
        dateTested: mockDate.toISOString(),
        remarks: mockRemarks,
        bloodChemistry: {
          fbs: 5.2,
          cholesterol: 200,
          triglycerides: 150,
          hdl: 50,
          ldl: 120,
          others: 'Normal findings'
        }
      });
    });

    it('should transform ECG data correctly', () => {
      const formData = {
        av: '1',
        qrs: '2',
        axis: '3',
        pr: '4',
        qt: '5',
        rhythm: 'Regular',
        interpretation: 'Normal ECG',
        interpreter: 'Dr. Smith'
      };

      const result = LabTestResultTransformer.transformFormDataToApiPayload(
        formData,
        'ecg',
        mockLabRequestId,
        mockDate
      );

      expect(result).toEqual({
        labRequestId: mockLabRequestId,
        dateTested: mockDate.toISOString(),
        remarks: 'Lab test results submitted',
        ecg: {
          av: '1',
          qrs: '2',
          axis: '3',
          pr: '4',
          qt: '5',
          rhythm: 'Regular',
          interpretation: 'Normal ECG',
          interpreter: 'Dr. Smith'
        }
      });
    });

    it('should transform urinalysis data correctly', () => {
      const formData = {
        color: 'Yellow',
        transparency: 'Clear',
        ph: '6.0',
        protein: 'Negative',
        glucose: 'Negative',
        redCells: '0-2/hpf',
        pusCells: '1-3/hpf',
        others: 'Within normal limits'
      };

      const result = LabTestResultTransformer.transformFormDataToApiPayload(
        formData,
        'urinalysis',
        mockLabRequestId,
        mockDate
      );

      expect(result.urinalysis).toEqual({
        color: 'Yellow',
        transparency: 'Clear',
        ph: '6.0',
        protein: 'Negative',
        glucose: 'Negative',
        redCells: '0-2/hpf',
        pusCells: '1-3/hpf',
        others: 'Within normal limits'
      });
    });

    it('should transform hematology data correctly (all strings)', () => {
      const formData = {
        hematocrit: '42',
        hemoglobin: '14.5',
        rbc: '4.8',
        wbc: '7.2',
        platelet: '350',
        segmenters: '65%',
        lymphocyte: '25%',
        others: 'Normal morphology'
      };

      const result = LabTestResultTransformer.transformFormDataToApiPayload(
        formData,
        'hematology',
        mockLabRequestId,
        mockDate
      );

      expect(result.hematology).toEqual({
        hematocrit: '42',
        hemoglobin: '14.5',
        rbc: '4.8',
        wbc: '7.2',
        platelet: '350',
        segmenters: '65%',
        lymphocyte: '25%',
        others: 'Normal morphology'
      });
    });

    it('should transform serology data correctly (numeric values)', () => {
      const formData = {
        ft3: '3.5',
        ft4: '15.2',
        tsh: '2.1'
      };

      const result = LabTestResultTransformer.transformFormDataToApiPayload(
        formData,
        'serology',
        mockLabRequestId,
        mockDate
      );

      expect(result.serology).toEqual({
        ft3: 3.5,
        ft4: 15.2,
        tsh: 2.1
      });
    });

    it('should transform dengue data correctly', () => {
      const formData = {
        igg: 'Positive',
        igm: 'Negative',
        ns1: 'Negative'
      };

      const result = LabTestResultTransformer.transformFormDataToApiPayload(
        formData,
        'dengue',
        mockLabRequestId,
        mockDate
      );

      expect(result.dengue).toEqual({
        igg: 'Positive',
        igm: 'Negative',
        ns1: 'Negative'
      });
    });

    it('should transform fecalysis data correctly', () => {
      const formData = {
        color: 'Brown',
        consistency: 'Soft',
        rbc: 'None',
        wbc: 'Few',
        occultBlood: 'Negative',
        others: 'No parasites seen'
      };

      const result = LabTestResultTransformer.transformFormDataToApiPayload(
        formData,
        'fecalysis',
        mockLabRequestId,
        mockDate
      );

      expect(result.fecalysis).toEqual({
        color: 'Brown',
        consistency: 'Soft',
        rbc: 'None',
        wbc: 'Few',
        occultBlood: 'Negative',
        others: 'No parasites seen'
      });
    });

    it('should transform coagulation data correctly (all strings)', () => {
      const formData = {
        patientPt: '12.5',
        controlPt: '12.0',
        inr: '1.1',
        patientPtt: '28',
        controlPtt: '30'
      };

      const result = LabTestResultTransformer.transformFormDataToApiPayload(
        formData,
        'coagulation',
        mockLabRequestId,
        mockDate
      );

      expect(result.coagulation).toEqual({
        patientPt: '12.5',
        controlPt: '12.0',
        inr: '1.1',
        patientPtt: '28',
        controlPtt: '30'
      });
    });

    it('should handle empty and whitespace values', () => {
      const formData = {
        fbs: '5.2',
        cholesterol: '',
        triglycerides: '   ',
        others: 'Normal'
      };

      const result = LabTestResultTransformer.transformFormDataToApiPayload(
        formData,
        'bloodChemistry',
        mockLabRequestId,
        mockDate
      );

      expect(result.bloodChemistry).toEqual({
        fbs: 5.2,
        others: 'Normal'
      });
    });

    it('should handle invalid numeric values gracefully', () => {
      const formData = {
        fbs: 'invalid',
        cholesterol: 'NaN',
        triglycerides: '150.5',
        others: 'Some findings'
      };

      const result = LabTestResultTransformer.transformFormDataToApiPayload(
        formData,
        'bloodChemistry',
        mockLabRequestId,
        mockDate
      );

      expect(result.bloodChemistry).toEqual({
        triglycerides: 150.5,
        others: 'Some findings'
      });
    });

    it('should handle unknown test categories', () => {
      const formData = { someField: 'value' };
      
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      const result = LabTestResultTransformer.transformFormDataToApiPayload(
        formData,
        'unknownCategory',
        mockLabRequestId,
        mockDate
      );

      expect(result).toEqual({
        labRequestId: mockLabRequestId,
        dateTested: mockDate.toISOString(),
        remarks: 'Lab test results submitted'
      });
      
      expect(consoleSpy).toHaveBeenCalledWith('Unknown test category: unknownCategory');
      consoleSpy.mockRestore();
    });

    it('should not include category section when no valid data', () => {
      const formData = {
        invalidField: 'value'
      };

      const result = LabTestResultTransformer.transformFormDataToApiPayload(
        formData,
        'bloodChemistry',
        mockLabRequestId,
        mockDate
      );

      expect(result.bloodChemistry).toBeUndefined();
    });
  });

  describe('validateFormData', () => {
    const enabledFields = ['fbs', 'cholesterol', 'triglycerides'];

    it('should return no errors for valid blood chemistry data', () => {
      const formData = {
        fbs: '5.2',
        cholesterol: '200',
        triglycerides: '150'
      };

      const errors = LabTestResultTransformer.validateFormData(formData, enabledFields, 'bloodChemistry');
      expect(errors).toEqual([]);
    });

    it('should return error when no data provided', () => {
      const formData = {};

      const errors = LabTestResultTransformer.validateFormData(formData, enabledFields, 'bloodChemistry');
      expect(errors).toContain('Please fill in at least one test result field');
    });

    it('should return error when all enabled fields are empty', () => {
      const formData = {
        fbs: '',
        cholesterol: '   '
      };

      const errors = LabTestResultTransformer.validateFormData(formData, enabledFields, 'bloodChemistry');
      expect(errors).toContain('Please fill in at least one test result field');
    });

    it('should validate blood chemistry numeric fields', () => {
      const formData = {
        fbs: 'invalid',
        cholesterol: '-50',
        triglycerides: '150'
      };

      const errors = LabTestResultTransformer.validateFormData(formData, enabledFields, 'bloodChemistry');
      expect(errors).toContain('FBS must be a valid positive number');
      expect(errors).toContain('CHOLESTEROL must be a valid positive number');
      expect(errors).not.toContain('TRIGLYCERIDES must be a valid positive number');
    });

    it('should validate serology numeric fields', () => {
      const formData = {
        ft3: 'invalid',
        ft4: '-5',
        tsh: '2.1'
      };

      const errors = LabTestResultTransformer.validateFormData(formData, ['ft3', 'ft4', 'tsh'], 'serology');
      expect(errors).toContain('FT3 must be a valid positive number');
      expect(errors).toContain('FT4 must be a valid positive number');
      expect(errors).not.toContain('TSH must be a valid positive number');
    });

    it('should handle hematology validation (string fields)', () => {
      const formData = {
        hematocrit: '42',
        hemoglobin: '14.5'
      };

      const errors = LabTestResultTransformer.validateFormData(formData, ['hematocrit', 'hemoglobin'], 'hematology');
      expect(errors).toEqual([]);
    });

    it('should handle coagulation validation (string fields)', () => {
      const formData = {
        patientPt: '12.5',
        inr: '1.1'
      };

      const errors = LabTestResultTransformer.validateFormData(formData, ['patientPt', 'inr'], 'coagulation');
      expect(errors).toEqual([]);
    });
  });

  describe('Mixed category data transformation', () => {
    it('should handle mixed form data but only transform relevant category', () => {
      const formData = {
        // Blood chemistry fields
        fbs: '5.2',
        cholesterol: '200',
        // ECG fields (should be ignored for blood chemistry)
        av: '1',
        qrs: '2',
        // Random field
        randomField: 'ignored'
      };

      const result = LabTestResultTransformer.transformFormDataToApiPayload(
        formData,
        'bloodChemistry',
        mockLabRequestId,
        mockDate
      );

      expect(result.bloodChemistry).toEqual({
        fbs: 5.2,
        cholesterol: 200
      });
      expect(result.ecg).toBeUndefined();
    });
  });

  describe('transformApiResultToFormData', () => {
    it('should transform API blood chemistry result to form data', () => {
      const apiResult = {
        bloodChemistry: {
          fbs: 5.2,
          cholesterol: 200,
          triglycerides: 150,
          hdl: 50,
          ldl: 120,
          others: 'Normal findings'
        }
      };

      const result = LabTestResultTransformer.transformApiResultToFormData(
        apiResult,
        'bloodChemistry'
      );

      expect(result).toEqual({
        fbs: '5.2',
        cholesterol: '200',
        triglycerides: '150',
        hdl: '50',
        ldl: '120',
        others: 'Normal findings'
      });
    });

    it('should transform API ECG result to form data', () => {
      const apiResult = {
        ecg: {
          av: '1',
          qrs: '2',
          axis: '3',
          pr: '4',
          qt: '5',
          rhythm: 'Regular',
          interpretation: 'Normal ECG',
          interpreter: 'Dr. Smith'
        }
      };

      const result = LabTestResultTransformer.transformApiResultToFormData(
        apiResult,
        'ecg'
      );

      expect(result).toEqual({
        av: '1',
        qrs: '2',
        axis: '3',
        pr: '4',
        qt: '5',
        rhythm: 'Regular',
        interpretation: 'Normal ECG',
        interpreter: 'Dr. Smith'
      });
    });

    it('should return empty object when no category data exists', () => {
      const apiResult = {
        bloodChemistry: {
          fbs: 5.2,
          cholesterol: 200
        }
      };

      const result = LabTestResultTransformer.transformApiResultToFormData(
        apiResult,
        'ecg' // Different category
      );

      expect(result).toEqual({});
    });

    it('should return empty object when apiResult is null or undefined', () => {
      const result1 = LabTestResultTransformer.transformApiResultToFormData(
        {} as never,
        'bloodChemistry'
      );

      const result2 = LabTestResultTransformer.transformApiResultToFormData(
        {} as never,
        'bloodChemistry'
      );

      expect(result1).toEqual({});
      expect(result2).toEqual({});
    });

    it('should handle null and undefined values in category data', () => {
      const apiResult = {
        bloodChemistry: {
          fbs: 5.2,
          cholesterol: undefined, // Changed from null to undefined to match interface
          triglycerides: undefined,
          hdl: 50,
          others: ''
        }
      };

      const result = LabTestResultTransformer.transformApiResultToFormData(
        apiResult,
        'bloodChemistry'
      );

      expect(result).toEqual({
        fbs: '5.2',
        hdl: '50',
        others: ''
      });
    });
  });

  describe('getCategoryFields', () => {
    it('should return correct fields for blood chemistry', () => {
      const fields = LabTestResultTransformer.getCategoryFields('bloodChemistry');
      
      expect(fields).toContain('fbs');
      expect(fields).toContain('cholesterol');
      expect(fields).toContain('triglycerides');
      expect(fields).toContain('others');
      expect(fields.length).toBeGreaterThan(10);
    });

    it('should return correct fields for ECG', () => {
      const fields = LabTestResultTransformer.getCategoryFields('ecg');
      
      expect(fields).toContain('av');
      expect(fields).toContain('qrs');
      expect(fields).toContain('rhythm');
      expect(fields).toContain('interpretation');
      expect(fields).toContain('interpreter');
    });

    it('should return empty array for unknown category', () => {
      const fields = LabTestResultTransformer.getCategoryFields('unknownCategory');
      
      expect(fields).toEqual([]);
    });
  });
});
