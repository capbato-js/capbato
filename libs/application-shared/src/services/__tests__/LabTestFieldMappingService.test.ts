import { LabTestFieldMappingService } from '../LabTestFieldMappingService';
import { LabTestData } from '@nx-starter/domain';

describe('LabTestFieldMappingService', () => {
  describe('getEnabledFields', () => {
    it('should enable FBS field when FBS is requested', () => {
      const requestedTests: LabTestData = {
        routine: {
          cbcWithPlatelet: false,
          pregnancyTest: false,
          urinalysis: false,
          fecalysis: false,
          occultBloodTest: false,
        },
        serology: {
          hepatitisBScreening: false,
          hepatitisAScreening: false,
          hepatitisCScreening: false,
          hepatitisProfile: false,
          vdrlRpr: false,
          crp: false,
          dengueNs1: false,
          aso: false,
          crf: false,
          raRf: false,
          tumorMarkers: false,
          ca125: false,
          cea: false,
          psa: false,
          betaHcg: false,
        },
        bloodChemistry: {
          fbs: true, // Only FBS requested
          bun: false,
          creatinine: false,
          bloodUricAcid: false,
          lipidProfile: false,
          sgot: false,
          sgpt: false,
          alkalinePhosphatase: false,
          sodium: false,
          potassium: false,
          hba1c: false,
        },
        miscellaneous: {
          ecg: false,
        },
        thyroid: {
          t3: false,
          t4: false,
          ft3: false,
          ft4: false,
          tsh: false,
        },
      };

      const result = LabTestFieldMappingService.getEnabledFields(requestedTests);
      
      expect(result.bloodChemistry).toContain('fbs');
      expect(result.bloodChemistry).toContain('others'); // Always enabled
      expect(result.bloodChemistry).toHaveLength(2);
    });

    it('should enable 5 lipid fields when lipid profile is requested', () => {
      const requestedTests: LabTestData = {
        routine: {
          cbcWithPlatelet: false,
          pregnancyTest: false,
          urinalysis: false,
          fecalysis: false,
          occultBloodTest: false,
        },
        serology: {
          hepatitisBScreening: false,
          hepatitisAScreening: false,
          hepatitisCScreening: false,
          hepatitisProfile: false,
          vdrlRpr: false,
          crp: false,
          dengueNs1: false,
          aso: false,
          crf: false,
          raRf: false,
          tumorMarkers: false,
          ca125: false,
          cea: false,
          psa: false,
          betaHcg: false,
        },
        bloodChemistry: {
          fbs: false,
          bun: false,
          creatinine: false,
          bloodUricAcid: false,
          lipidProfile: true, // Lipid profile requested
          sgot: false,
          sgpt: false,
          alkalinePhosphatase: false,
          sodium: false,
          potassium: false,
          hba1c: false,
        },
        miscellaneous: {
          ecg: false,
        },
        thyroid: {
          t3: false,
          t4: false,
          ft3: false,
          ft4: false,
          tsh: false,
        },
      };

      const result = LabTestFieldMappingService.getEnabledFields(requestedTests);
      
      expect(result.bloodChemistry).toContain('cholesterol');
      expect(result.bloodChemistry).toContain('triglycerides');
      expect(result.bloodChemistry).toContain('hdl');
      expect(result.bloodChemistry).toContain('ldl');
      expect(result.bloodChemistry).toContain('vldl');
      expect(result.bloodChemistry).toContain('others');
      expect(result.bloodChemistry).toHaveLength(6);
    });

    it('should enable all urinalysis fields except pregnancy test when urinalysis is requested', () => {
      const requestedTests: LabTestData = {
        routine: {
          cbcWithPlatelet: false,
          pregnancyTest: false,
          urinalysis: true, // Urinalysis requested
          fecalysis: false,
          occultBloodTest: false,
        },
        serology: {
          hepatitisBScreening: false,
          hepatitisAScreening: false,
          hepatitisCScreening: false,
          hepatitisProfile: false,
          vdrlRpr: false,
          crp: false,
          dengueNs1: false,
          aso: false,
          crf: false,
          raRf: false,
          tumorMarkers: false,
          ca125: false,
          cea: false,
          psa: false,
          betaHcg: false,
        },
        bloodChemistry: {
          fbs: false,
          bun: false,
          creatinine: false,
          bloodUricAcid: false,
          lipidProfile: false,
          sgot: false,
          sgpt: false,
          alkalinePhosphatase: false,
          sodium: false,
          potassium: false,
          hba1c: false,
        },
        miscellaneous: {
          ecg: false,
        },
        thyroid: {
          t3: false,
          t4: false,
          ft3: false,
          ft4: false,
          tsh: false,
        },
      };

      const result = LabTestFieldMappingService.getEnabledFields(requestedTests);
      
      expect(result.urinalysis).toContain('color');
      expect(result.urinalysis).toContain('transparency');
      expect(result.urinalysis).toContain('specificGravity');
      expect(result.urinalysis).toContain('others');
      expect(result.urinalysis).not.toContain('pregnancyTest'); // Should be excluded
      expect(result.urinalysis).toHaveLength(14); // 13 regular fields + others
    });

    it('should enable only pregnancy test when pregnancy test is requested', () => {
      const requestedTests: LabTestData = {
        routine: {
          cbcWithPlatelet: false,
          pregnancyTest: true, // Only pregnancy test requested
          urinalysis: false,
          fecalysis: false,
          occultBloodTest: false,
        },
        serology: {
          hepatitisBScreening: false,
          hepatitisAScreening: false,
          hepatitisCScreening: false,
          hepatitisProfile: false,
          vdrlRpr: false,
          crp: false,
          dengueNs1: false,
          aso: false,
          crf: false,
          raRf: false,
          tumorMarkers: false,
          ca125: false,
          cea: false,
          psa: false,
          betaHcg: false,
        },
        bloodChemistry: {
          fbs: false,
          bun: false,
          creatinine: false,
          bloodUricAcid: false,
          lipidProfile: false,
          sgot: false,
          sgpt: false,
          alkalinePhosphatase: false,
          sodium: false,
          potassium: false,
          hba1c: false,
        },
        miscellaneous: {
          ecg: false,
        },
        thyroid: {
          t3: false,
          t4: false,
          ft3: false,
          ft4: false,
          tsh: false,
        },
      };

      const result = LabTestFieldMappingService.getEnabledFields(requestedTests);
      
      expect(result.urinalysis).toContain('pregnancyTest');
      expect(result.urinalysis).toHaveLength(1); // Only pregnancy test
    });

    it('should enable all dengue fields when dengue NS1 is requested', () => {
      const requestedTests: LabTestData = {
        routine: {
          cbcWithPlatelet: false,
          pregnancyTest: false,
          urinalysis: false,
          fecalysis: false,
          occultBloodTest: false,
        },
        serology: {
          hepatitisBScreening: false,
          hepatitisAScreening: false,
          hepatitisCScreening: false,
          hepatitisProfile: false,
          vdrlRpr: false,
          crp: false,
          dengueNs1: true, // Dengue test requested
          aso: false,
          crf: false,
          raRf: false,
          tumorMarkers: false,
          ca125: false,
          cea: false,
          psa: false,
          betaHcg: false,
        },
        bloodChemistry: {
          fbs: false,
          bun: false,
          creatinine: false,
          bloodUricAcid: false,
          lipidProfile: false,
          sgot: false,
          sgpt: false,
          alkalinePhosphatase: false,
          sodium: false,
          potassium: false,
          hba1c: false,
        },
        miscellaneous: {
          ecg: false,
        },
        thyroid: {
          t3: false,
          t4: false,
          ft3: false,
          ft4: false,
          tsh: false,
        },
      };

      const result = LabTestFieldMappingService.getEnabledFields(requestedTests);
      
      expect(result.dengue).toContain('igg');
      expect(result.dengue).toContain('igm');
      expect(result.dengue).toContain('ns1');
      expect(result.dengue).toHaveLength(3);
    });
  });
});
