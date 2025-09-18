import { describe, it, expect } from 'vitest';

describe('medical-records components index', () => {
  it('should export AddLabTestForm', async () => {
    const module = await import('./index');
    expect(module.AddLabTestForm).toBeDefined();
  }, 10000);

  it('should export AddLabTestResultForm', async () => {
    const module = await import('./index');
    expect(module.AddLabTestResultForm).toBeDefined();
    expect(typeof module.AddLabTestResultForm).toBe('function');
  });

  it('should export AddPrescriptionForm', async () => {
    const module = await import('./index');
    expect(module.AddPrescriptionForm).toBeDefined();
  });

  it('should export AddPrescriptionModal', async () => {
    const module = await import('./index');
    expect(module.AddPrescriptionModal).toBeDefined();
  });

  it('should export DeletePrescriptionModal', async () => {
    const module = await import('./index');
    expect(module.DeletePrescriptionModal).toBeDefined();
  });

  it('should export ViewPrescriptionModal', async () => {
    const module = await import('./index');
    expect(module.ViewPrescriptionModal).toBeDefined();
  });

  it('should export LaboratoryTestsPageHeader', async () => {
    const module = await import('./index');
    expect(module.LaboratoryTestsPageHeader).toBeDefined();
  });

  it('should export LaboratoryTestsTable', async () => {
    const module = await import('./index');
    expect(module.LaboratoryTestsTable).toBeDefined();
  });

  it('should export LaboratoryTestsModals', async () => {
    const module = await import('./index');
    expect(module.LaboratoryTestsModals).toBeDefined();
  });

  it('should export UrinalysisReportView', async () => {
    const module = await import('./index');
    expect(module.UrinalysisReportView).toBeDefined();
  });

  it('should export all expected components', async () => {
    const module = await import('./index');
    const expectedExports = [
      'AddLabTestForm',
      'AddLabTestResultForm',
      'AddPrescriptionForm',
      'AddPrescriptionModal',
      'DeletePrescriptionModal',
      'ViewPrescriptionModal',
      'LaboratoryTestsPageHeader',
      'LaboratoryTestsTable',
      'LaboratoryTestsModals',
      'UrinalysisReportView'
    ];

    expectedExports.forEach(exportName => {
      expect(module[exportName]).toBeDefined();
      expect(typeof module[exportName]).toBe('function');
    });
  });
});