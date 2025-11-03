import { injectable } from 'tsyringe';
import { Repository, DataSource } from 'typeorm';
import { LabTestPrice } from '@nx-starter/domain';
import { generateId } from '@nx-starter/utils-core';
import { LabTestPriceEntity } from './LabTestPriceEntity';

export interface ILabTestPriceRepository {
  save(labTestPrice: LabTestPrice): Promise<LabTestPrice>;
  findById(id: string): Promise<LabTestPrice | null>;
  findAll(): Promise<LabTestPrice[]>;
  findByTestId(testId: string): Promise<LabTestPrice | null>;
  findByCategory(category: string): Promise<LabTestPrice[]>;
  seedInitialPrices(): Promise<void>;
}

@injectable()
export class TypeOrmLabTestPriceRepository implements ILabTestPriceRepository {
  private readonly repository: Repository<LabTestPriceEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(LabTestPriceEntity);
  }

  async save(labTestPrice: LabTestPrice): Promise<LabTestPrice> {
    const entity = this.domainToEntity(labTestPrice);
    if (!entity.id) {
      entity.id = generateId();
    }
    const savedEntity = await this.repository.save(entity);
    return this.entityToDomain(savedEntity);
  }

  async findById(id: string): Promise<LabTestPrice | null> {
    const entity = await this.repository.findOne({
      where: { id }
    });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findAll(): Promise<LabTestPrice[]> {
    const entities = await this.repository.find({
      order: { category: 'ASC', testName: 'ASC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async findByTestId(testId: string): Promise<LabTestPrice | null> {
    const entity = await this.repository.findOne({
      where: { testId }
    });
    return entity ? this.entityToDomain(entity) : null;
  }

  async findByCategory(category: string): Promise<LabTestPrice[]> {
    const entities = await this.repository.find({
      where: { category },
      order: { testName: 'ASC' }
    });
    return entities.map(entity => this.entityToDomain(entity));
  }

  async seedInitialPrices(): Promise<void> {
    const count = await this.repository.count();
    if (count > 0) {
      console.log('Lab test prices already seeded, skipping...');
      return;
    }

    const initialPrices = [
      // ROUTINE Tests
      { testId: 'routine_cbc_with_platelet', testName: 'CBC with Platelet', price: 210, category: 'ROUTINE' },
      { testId: 'routine_pregnancy_test', testName: 'Pregnancy Test', price: 250, category: 'ROUTINE' },
      { testId: 'routine_urinalysis', testName: 'Urinalysis', price: 80, category: 'ROUTINE' },
      { testId: 'routine_fecalysis', testName: 'Fecalysis', price: 80, category: 'ROUTINE' },
      { testId: 'routine_occult_blood_test', testName: 'Occult Blood Test', price: 150, category: 'ROUTINE' },

      // SEROLOGY & IMMUNOLOGY Tests
      { testId: 'serology_hepatitis_b_screening', testName: 'Hepatitis B Screening', price: 250, category: 'SEROLOGY_IMMUNOLOGY' },
      { testId: 'serology_hepatitis_a_screening', testName: 'Hepatitis A Screening', price: 450, category: 'SEROLOGY_IMMUNOLOGY' },
      { testId: 'serology_hepatitis_profile', testName: 'Hepatitis Profile', price: 1700, category: 'SEROLOGY_IMMUNOLOGY' },
      { testId: 'serology_vdrl_rpr', testName: 'VDRL/RPR', price: 250, category: 'SEROLOGY_IMMUNOLOGY' },
      { testId: 'serology_dengue_ns1', testName: 'Dengue NS1', price: 1200, category: 'SEROLOGY_IMMUNOLOGY' },
      { testId: 'serology_psa', testName: 'PSA', price: 1300, category: 'SEROLOGY_IMMUNOLOGY' },

      // BLOOD CHEMISTRY Tests
      { testId: 'blood_chemistry_fbs', testName: 'FBS', price: 120, category: 'BLOOD_CHEMISTRY' },
      { testId: 'blood_chemistry_bun', testName: 'BUN', price: 120, category: 'BLOOD_CHEMISTRY' },
      { testId: 'blood_chemistry_creatinine', testName: 'Creatinine', price: 150, category: 'BLOOD_CHEMISTRY' },
      { testId: 'blood_chemistry_blood_uric_acid', testName: 'Blood Uric Acid', price: 120, category: 'BLOOD_CHEMISTRY' },
      { testId: 'blood_chemistry_lipid_profile', testName: 'Lipid Profile', price: 700, category: 'BLOOD_CHEMISTRY' },
      { testId: 'blood_chemistry_sgot', testName: 'SGOT', price: 200, category: 'BLOOD_CHEMISTRY' },
      { testId: 'blood_chemistry_sgpt', testName: 'SGPT', price: 200, category: 'BLOOD_CHEMISTRY' },
      { testId: 'blood_chemistry_alkaline_phosphatase', testName: 'Alkaline Phosphatase (ALP)', price: 300, category: 'BLOOD_CHEMISTRY' },
      { testId: 'blood_chemistry_sodium', testName: 'Sodium (Na)', price: 200, category: 'BLOOD_CHEMISTRY' },
      { testId: 'blood_chemistry_potassium', testName: 'Potassium (K+)', price: 200, category: 'BLOOD_CHEMISTRY' },
      { testId: 'blood_chemistry_hba1c', testName: 'HBA1C', price: 550, category: 'BLOOD_CHEMISTRY' },

      // THYROID FUNCTION Tests
      { testId: 'thyroid_t3', testName: 'T3', price: 500, category: 'THYROID_FUNCTION' },
      { testId: 'thyroid_t4', testName: 'T4', price: 500, category: 'THYROID_FUNCTION' },
      { testId: 'thyroid_ft3', testName: 'FT3', price: 600, category: 'THYROID_FUNCTION' },
      { testId: 'thyroid_ft4', testName: 'FT4', price: 600, category: 'THYROID_FUNCTION' },
      { testId: 'thyroid_tsh', testName: 'TSH', price: 600, category: 'THYROID_FUNCTION' },

      // MISCELLANEOUS Tests
      { testId: 'misc_ecg', testName: 'ECG', price: 250, category: 'MISCELLANEOUS' },
    ];

    const entities = initialPrices.map(price => {
      const entity = new LabTestPriceEntity();
      entity.id = generateId();
      entity.testId = price.testId;
      entity.testName = price.testName;
      entity.price = price.price;
      entity.category = price.category;
      return entity;
    });

    await this.repository.save(entities);
    console.log(`✅ Seeded ${entities.length} lab test prices`);
  }

  private domainToEntity(labTestPrice: LabTestPrice): LabTestPriceEntity {
    const entity = new LabTestPriceEntity();
    entity.id = labTestPrice.id || '';
    entity.testId = labTestPrice.testId;
    entity.testName = labTestPrice.testName;
    entity.price = labTestPrice.price;
    entity.category = labTestPrice.category;
    entity.createdAt = labTestPrice.createdAt;
    entity.updatedAt = labTestPrice.updatedAt;
    return entity;
  }

  private entityToDomain(entity: LabTestPriceEntity): LabTestPrice {
    return new LabTestPrice(
      entity.testId,
      entity.testName,
      entity.price,
      entity.category,
      entity.createdAt,
      entity.updatedAt,
      entity.id
    );
  }
}
