import { injectable } from 'tsyringe';
import { Repository, DataSource, Like } from 'typeorm';
import { Patient } from '@nx-starter/application-shared';
import { IPatientRepository } from '@nx-starter/application-shared';
import { PatientEntity } from './PatientEntity';
import { generateUUID } from '@nx-starter/utils-core';
import { PatientNotFoundError } from '@nx-starter/application-shared';

/**
 * TypeORM implementation of IPatientRepository
 * Supports MySQL, PostgreSQL, SQLite via TypeORM
 */
@injectable()
export class TypeOrmPatientRepository implements IPatientRepository {
  private repository: Repository<PatientEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(PatientEntity);
  }

  async getAll(): Promise<Patient[]> {
    const entities = await this.repository.find({
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async create(patient: Patient): Promise<string> {
    const id = generateUUID();
    const entity = this.repository.create({
      id,
      patientNumber: patient.patientNumber,
      firstName: patient.firstName,
      lastName: patient.lastName,
      middleName: patient.middleName,
      dateOfBirth: patient.dateOfBirth,
      gender: patient.gender,
      contactNumber: patient.contactNumber,
      // Address fields
      houseNumber: patient.houseNumber,
      streetName: patient.streetName,
      province: patient.province,
      cityMunicipality: patient.cityMunicipality,
      barangay: patient.barangay,
      // Guardian fields
      guardianName: patient.guardianName,
      guardianGender: patient.guardianGender,
      guardianRelationship: patient.guardianRelationship,
      guardianContactNumber: patient.guardianContactNumber,
      // Guardian address fields
      guardianHouseNumber: patient.guardianHouseNumber,
      guardianStreetName: patient.guardianStreetName,
      guardianProvince: patient.guardianProvince,
      guardianCityMunicipality: patient.guardianCityMunicipality,
      guardianBarangay: patient.guardianBarangay,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    });

    await this.repository.save(entity);
    return id;
  }

  async getById(id: string): Promise<Patient | undefined> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : undefined;
  }

  async getByPatientNumber(patientNumber: string): Promise<Patient | undefined> {
    const entity = await this.repository.findOne({ 
      where: { patientNumber } 
    });
    return entity ? this.toDomain(entity) : undefined;
  }

  async getByContactNumber(contactNumber: string): Promise<Patient | undefined> {
    const entity = await this.repository.findOne({ 
      where: { contactNumber } 
    });
    return entity ? this.toDomain(entity) : undefined;
  }

  async update(id: string, changes: Partial<Patient>): Promise<void> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new PatientNotFoundError(id);
    }

    const updateData: Partial<PatientEntity> = {
      updatedAt: new Date(),
    };

    // Map domain changes to entity properties
    if (changes.firstName !== undefined) updateData.firstName = changes.firstName;
    if (changes.lastName !== undefined) updateData.lastName = changes.lastName;
    if (changes.middleName !== undefined) updateData.middleName = changes.middleName;
    if (changes.dateOfBirth !== undefined) updateData.dateOfBirth = changes.dateOfBirth;
    if (changes.gender !== undefined) updateData.gender = changes.gender;
    if (changes.contactNumber !== undefined) updateData.contactNumber = changes.contactNumber;
    
    // Address fields
    if (changes.houseNumber !== undefined) updateData.houseNumber = changes.houseNumber;
    if (changes.streetName !== undefined) updateData.streetName = changes.streetName;
    if (changes.province !== undefined) updateData.province = changes.province;
    if (changes.cityMunicipality !== undefined) updateData.cityMunicipality = changes.cityMunicipality;
    if (changes.barangay !== undefined) updateData.barangay = changes.barangay;
    
    // Guardian fields
    if (changes.guardianName !== undefined) updateData.guardianName = changes.guardianName;
    if (changes.guardianGender !== undefined) updateData.guardianGender = changes.guardianGender;
    if (changes.guardianRelationship !== undefined) updateData.guardianRelationship = changes.guardianRelationship;
    if (changes.guardianContactNumber !== undefined) updateData.guardianContactNumber = changes.guardianContactNumber;
    
    // Guardian address fields
    if (changes.guardianHouseNumber !== undefined) updateData.guardianHouseNumber = changes.guardianHouseNumber;
    if (changes.guardianStreetName !== undefined) updateData.guardianStreetName = changes.guardianStreetName;
    if (changes.guardianProvince !== undefined) updateData.guardianProvince = changes.guardianProvince;
    if (changes.guardianCityMunicipality !== undefined) updateData.guardianCityMunicipality = changes.guardianCityMunicipality;
    if (changes.guardianBarangay !== undefined) updateData.guardianBarangay = changes.guardianBarangay;

    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new PatientNotFoundError(id);
    }
  }

  async getTotalCount(): Promise<number> {
    return await this.repository.count();
  }

  async getCountByGender(): Promise<{ male: number; female: number }> {
    const [maleCount, femaleCount] = await Promise.all([
      this.repository.count({ where: { gender: 'Male' } }),
      this.repository.count({ where: { gender: 'Female' } }),
    ]);

    return {
      male: maleCount,
      female: femaleCount,
    };
  }

  async getCountByAgeCategory(): Promise<{ children: number; adults: number; seniors: number }> {
    // For age-based queries, we'll need to calculate based on current date
    const currentYear = new Date().getFullYear();
    const currentDate = new Date();
    
    // Calculate birth year thresholds
    const childThreshold = new Date();
    childThreshold.setFullYear(currentYear - 18);
    
    const seniorThreshold = new Date();
    seniorThreshold.setFullYear(currentYear - 60);

    const [childrenCount, seniorsCount, totalCount] = await Promise.all([
      // Children: born after (current year - 18)
      this.repository
        .createQueryBuilder('patient')
        .where('patient.dateOfBirth > :childThreshold', { childThreshold })
        .getCount(),
      
      // Seniors: born before (current year - 60)
      this.repository
        .createQueryBuilder('patient')
        .where('patient.dateOfBirth <= :seniorThreshold', { seniorThreshold })
        .getCount(),
      
      this.getTotalCount(),
    ]);

    const adultsCount = totalCount - childrenCount - seniorsCount;

    return {
      children: childrenCount,
      adults: Math.max(0, adultsCount),
      seniors: seniorsCount,
    };
  }

  async countByPatientNumberPrefix(prefix: string): Promise<number> {
    return await this.repository.count({
      where: { patientNumber: Like(`${prefix}%`) },
    });
  }

  async existsByPatientNumber(patientNumber: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { patientNumber },
    });
    return count > 0;
  }

  async existsByContactNumber(contactNumber: string, excludeId?: string): Promise<boolean> {
    const queryBuilder = this.repository
      .createQueryBuilder('patient')
      .where('patient.contactNumber = :contactNumber', { contactNumber });

    if (excludeId) {
      queryBuilder.andWhere('patient.id != :excludeId', { excludeId });
    }

    const count = await queryBuilder.getCount();
    return count > 0;
  }

  async searchByName(searchTerm: string, limit?: number): Promise<Patient[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('patient')
      .where('patient.firstName LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('patient.lastName LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orWhere('patient.middleName LIKE :searchTerm', { searchTerm: `%${searchTerm}%` })
      .orderBy('patient.lastName', 'ASC')
      .addOrderBy('patient.firstName', 'ASC');

    if (limit) {
      queryBuilder.limit(limit);
    }

    const entities = await queryBuilder.getMany();
    return entities.map(this.toDomain);
  }

  async getByAgeRange(minAge: number, maxAge: number): Promise<Patient[]> {
    const currentYear = new Date().getFullYear();
    
    // For age range, we calculate birth year range
    const maxBirthYear = currentYear - minAge;
    const minBirthYear = currentYear - maxAge;

    const startDate = new Date(`${minBirthYear}-01-01`);
    const endDate = new Date(`${maxBirthYear}-12-31`);

    const entities = await this.repository
      .createQueryBuilder('patient')
      .where('patient.dateOfBirth BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('patient.dateOfBirth', 'DESC')
      .getMany();

    return entities.map(this.toDomain);
  }

  async getByGender(gender: 'Male' | 'Female'): Promise<Patient[]> {
    const entities = await this.repository.find({
      where: { gender },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getByDateRange(startDate: Date, endDate: Date): Promise<Patient[]> {
    const entities = await this.repository
      .createQueryBuilder('patient')
      .where('patient.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .orderBy('patient.createdAt', 'DESC')
      .getMany();

    return entities.map(this.toDomain);
  }

  async getWithGuardianInfo(): Promise<Patient[]> {
    const entities = await this.repository
      .createQueryBuilder('patient')
      .where('patient.guardianName IS NOT NULL')
      .andWhere('patient.guardianName != :empty', { empty: '' })
      .orderBy('patient.lastName', 'ASC')
      .addOrderBy('patient.firstName', 'ASC')
      .getMany();

    return entities.map(this.toDomain);
  }

  async getWithoutGuardianInfo(): Promise<Patient[]> {
    const entities = await this.repository
      .createQueryBuilder('patient')
      .where('patient.guardianName IS NULL OR patient.guardianName = :empty', { empty: '' })
      .orderBy('patient.lastName', 'ASC')
      .addOrderBy('patient.firstName', 'ASC')
      .getMany();

    return entities.map(this.toDomain);
  }

  /**
   * Converts TypeORM entity to domain object
   */
  private toDomain(entity: PatientEntity): Patient {
    return new Patient(
      entity.patientNumber,
      entity.firstName,
      entity.lastName,
      entity.dateOfBirth,
      entity.gender,
      entity.contactNumber,
      {
        houseNumber: entity.houseNumber,
        streetName: entity.streetName,
        province: entity.province,
        cityMunicipality: entity.cityMunicipality,
        barangay: entity.barangay,
      },
      {
        id: entity.id,
        middleName: entity.middleName,
        guardianName: entity.guardianName,
        guardianGender: entity.guardianGender,
        guardianRelationship: entity.guardianRelationship,
        guardianContactNumber: entity.guardianContactNumber,
        guardianAddressInfo: {
          houseNumber: entity.guardianHouseNumber,
          streetName: entity.guardianStreetName,
          province: entity.guardianProvince,
          cityMunicipality: entity.guardianCityMunicipality,
          barangay: entity.guardianBarangay,
        },
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      }
    );
  }
}