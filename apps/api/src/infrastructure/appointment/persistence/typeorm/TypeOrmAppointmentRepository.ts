import { injectable } from 'tsyringe';
import { Repository, DataSource, Between } from 'typeorm';
import { Appointment } from '@nx-starter/domain';
import type { IAppointmentRepository } from '@nx-starter/domain';
import { AppointmentMapper } from '@nx-starter/application-shared';
import { NameFormattingService } from '@nx-starter/domain';
import { AppointmentEntity } from './AppointmentEntity';
import { generateId, generateUUID } from '@nx-starter/utils-core';
import { PatientEntity } from '../../../patient/persistence/typeorm/PatientEntity';
import { DoctorEntity } from '../../../doctor/persistence/typeorm/DoctorEntity';
import { UserEntity } from '../../../user/persistence/typeorm/UserEntity';

/**
 * Extended appointment data with populated patient and doctor information
 */
export interface AppointmentWithRelations {
  appointment: AppointmentEntity;
  patient: PatientEntity;
  doctor: DoctorEntity;
  doctorUser: UserEntity;
}

/**
 * Extended appointment data with populated patient and doctor information
 */
export interface AppointmentWithRelations {
  appointment: AppointmentEntity;
  patient: PatientEntity;
  doctor: DoctorEntity;
  doctorUser: UserEntity;
}

/**
 * TypeORM implementation of IAppointmentRepository
 * Supports MySQL, PostgreSQL, SQLite via TypeORM
 */
@injectable()
export class TypeOrmAppointmentRepository implements IAppointmentRepository {
  private repository: Repository<AppointmentEntity>;

  constructor(private dataSource: DataSource) {
    this.repository = this.dataSource.getRepository(AppointmentEntity);
  }

  async getAll(): Promise<Appointment[]> {
    const queryBuilder = this.repository.createQueryBuilder('appointment')
      .leftJoinAndSelect('patients', 'patient', 'patient.id = appointment.patient_id')
      .leftJoinAndSelect('doctors', 'doctor', 'doctor.id = appointment.doctor_id')
      .leftJoinAndSelect('users', 'doctorUser', 'doctorUser.id = doctor.user_id')
      .orderBy('appointment.created_at', 'DESC');

    const results = await queryBuilder.getRawMany();
    
    return results.map(row => this.toDomainWithRelations({
      appointment: {
        id: row.appointment_id,
        patientId: row.appointment_patient_id,
        reasonForVisit: row.appointment_reason_for_visit,
        appointmentDate: row.appointment_appointment_date,
        appointmentTime: row.appointment_appointment_time,
        status: row.appointment_status,
        doctorId: row.appointment_doctor_id,
        createdAt: row.appointment_created_at,
        updatedAt: row.appointment_updated_at,
      } as AppointmentEntity,
      patient: {
        id: row.patient_id,
        patientNumber: row.patient_patient_number,
        firstName: row.patient_first_name,
        lastName: row.patient_last_name,
        middleName: row.patient_middle_name,
        dateOfBirth: row.patient_date_of_birth,
        gender: row.patient_gender,
        contactNumber: row.patient_contact_number,
        houseNumber: row.patient_house_number,
        streetName: row.patient_street_name,
        province: row.patient_province,
        cityMunicipality: row.patient_city_municipality,
        barangay: row.patient_barangay,
        guardianName: row.patient_guardian_name,
        guardianGender: row.patient_guardian_gender,
        guardianRelationship: row.patient_guardian_relationship,
        guardianContactNumber: row.patient_guardian_contact_number,
        guardianHouseNumber: row.patient_guardian_house_number,
        guardianStreetName: row.patient_guardian_street_name,
        guardianProvince: row.patient_guardian_province,
        guardianCityMunicipality: row.patient_guardian_city_municipality,
        guardianBarangay: row.patient_guardian_barangay,
        createdAt: row.patient_created_at,
        updatedAt: row.patient_updated_at,
      } as PatientEntity,
      doctor: {
        id: row.doctor_id,
        userId: row.doctor_user_id,
        specialization: row.doctor_Specialization,
        licenseNumber: row.doctor_license_number,
        yearsOfExperience: row.doctor_years_of_experience,
        isActive: row.doctor_is_active,
      } as DoctorEntity,
      doctorUser: {
        id: row.doctorUser_id,
        firstName: row.doctorUser_firstName,
        lastName: row.doctorUser_lastName,
        email: row.doctorUser_email,
        username: row.doctorUser_username,
        hashedPassword: row.doctorUser_hashedPassword,
        role: row.doctorUser_role,
        mobile: row.doctorUser_mobile,
        createdAt: row.doctorUser_createdAt,
      } as UserEntity
    }));
  }

  async create(appointment: Appointment): Promise<string> {
    const id = generateId();
    const entity = this.repository.create({
      id,
      patientId: appointment.patientId,
      reasonForVisit: appointment.reasonForVisit,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.timeValue,
      status: appointment.statusValue,
      doctorId: appointment.doctorId,
      createdAt: appointment.createdAt,
    });

    await this.repository.save(entity);
    return id;
  }

  async update(id: string, changes: Partial<Appointment>): Promise<void> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) {
      throw new Error(`Appointment with ID ${id} not found`);
    }

    const updateData: Partial<AppointmentEntity> = {};

    if (changes.patientId !== undefined) updateData.patientId = changes.patientId;
    if (changes.reasonForVisit !== undefined) updateData.reasonForVisit = changes.reasonForVisit;
    if (changes.appointmentDate !== undefined) updateData.appointmentDate = changes.appointmentDate;
    if (changes.appointmentTime !== undefined) {
      updateData.appointmentTime = typeof changes.appointmentTime === 'string' 
        ? changes.appointmentTime 
        : (changes.appointmentTime as { value: string }).value;
    }
    if (changes.statusValue !== undefined) updateData.status = changes.statusValue;
    if (changes.doctorId !== undefined) updateData.doctorId = changes.doctorId;
    
    updateData.updatedAt = new Date();

    await this.repository.update(id, updateData);
  }

  async delete(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Appointment with ID ${id} not found`);
    }
  }

  async getById(id: string): Promise<Appointment | undefined> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : undefined;
  }

  async getByPatientId(patientId: string): Promise<Appointment[]> {
    const queryBuilder = this.repository.createQueryBuilder('appointment')
      .leftJoinAndSelect('patients', 'patient', 'patient.id = appointment.patient_id')
      .leftJoinAndSelect('doctors', 'doctor', 'doctor.id = appointment.doctor_id')
      .leftJoinAndSelect('users', 'doctorUser', 'doctorUser.id = doctor.user_id')
      .where('appointment.patient_id = :patientId', { patientId })
      .orderBy('appointment.appointment_date', 'DESC')
      .addOrderBy('appointment.appointment_time', 'DESC');

    const results = await queryBuilder.getRawMany();
    
    return results.map(row => this.toDomainWithRelations({
      appointment: {
        id: row.appointment_id,
        patientId: row.appointment_patient_id,
        reasonForVisit: row.appointment_reason_for_visit,
        appointmentDate: row.appointment_appointment_date,
        appointmentTime: row.appointment_appointment_time,
        status: row.appointment_status,
        doctorId: row.appointment_doctor_id,
        createdAt: row.appointment_created_at,
        updatedAt: row.appointment_updated_at,
      } as AppointmentEntity,
      patient: {
        id: row.patient_id,
        patientNumber: row.patient_patient_number,
        firstName: row.patient_first_name,
        lastName: row.patient_last_name,
        middleName: row.patient_middle_name,
        dateOfBirth: row.patient_date_of_birth,
        gender: row.patient_gender,
        contactNumber: row.patient_contact_number,
        houseNumber: row.patient_house_number,
        streetName: row.patient_street_name,
        province: row.patient_province,
        cityMunicipality: row.patient_city_municipality,
        barangay: row.patient_barangay,
        guardianName: row.patient_guardian_name,
        guardianGender: row.patient_guardian_gender,
        guardianRelationship: row.patient_guardian_relationship,
        guardianContactNumber: row.patient_guardian_contact_number,
        guardianHouseNumber: row.patient_guardian_house_number,
        guardianStreetName: row.patient_guardian_street_name,
        guardianProvince: row.patient_guardian_province,
        guardianCityMunicipality: row.patient_guardian_city_municipality,
        guardianBarangay: row.patient_guardian_barangay,
        createdAt: row.patient_created_at,
        updatedAt: row.patient_updated_at,
      } as PatientEntity,
      doctor: {
        id: row.doctor_id,
        userId: row.doctor_user_id,
        specialization: row.doctor_Specialization,
        licenseNumber: row.doctor_license_number,
        yearsOfExperience: row.doctor_years_of_experience,
        isActive: row.doctor_is_active,
      } as DoctorEntity,
      doctorUser: {
        id: row.doctorUser_id,
        firstName: row.doctorUser_firstName,
        lastName: row.doctorUser_lastName,
        email: row.doctorUser_email,
        username: row.doctorUser_username,
        hashedPassword: row.doctorUser_hashedPassword,
        role: row.doctorUser_role,
        mobile: row.doctorUser_mobile,
        createdAt: row.doctorUser_createdAt,
      } as UserEntity
    }));
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const entities = await this.repository.find({
      where: {
        appointmentDate: Between(today, tomorrow),
      },
      order: { appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getTodayConfirmedAppointments(): Promise<Appointment[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const entities = await this.repository.find({
      where: {
        appointmentDate: Between(today, tomorrow),
        status: 'confirmed',
      },
      order: { appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getConfirmedAppointments(): Promise<Appointment[]> {
    const entities = await this.repository.find({
      where: { status: 'confirmed' },
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getAppointmentsByDate(date: Date): Promise<Appointment[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const entities = await this.repository.find({
      where: {
        appointmentDate: Between(startOfDay, endOfDay),
      },
      order: { appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getAppointmentsByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    const entities = await this.repository.find({
      where: {
        appointmentDate: Between(startDate, endDate),
      },
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });
    return entities.map(this.toDomain);
  }

  async getWeeklyAppointmentSummary(): Promise<{ date: string; count: number }[]> {
    const today = new Date();
    const sixDaysAgo = new Date(today);
    sixDaysAgo.setDate(today.getDate() - 6);
    sixDaysAgo.setHours(0, 0, 0, 0);

    const result = await this.repository
      .createQueryBuilder('appointment')
      .select('DATE(appointment.appointmentDate)', 'date')
      .addSelect('COUNT(*)', 'count')
      .where('appointment.status = :status', { status: 'confirmed' })
      .andWhere('appointment.appointmentDate >= :startDate', { startDate: sixDaysAgo })
      .groupBy('DATE(appointment.appointmentDate)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return result.map(row => ({
      date: row.date,
      count: parseInt(row.count, 10),
    }));
  }

  async checkTimeSlotAvailability(date: Date, time: string, excludeId?: string): Promise<boolean> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const queryBuilder = this.repository
      .createQueryBuilder('appointment')
      .where('appointment.appointmentDate BETWEEN :startOfDay AND :endOfDay', { startOfDay, endOfDay })
      .andWhere('appointment.appointmentTime = :time', { time })
      .andWhere('appointment.status = :status', { status: 'confirmed' });

    if (excludeId) {
      queryBuilder.andWhere('appointment.id != :excludeId', { excludeId });
    }

    const count = await queryBuilder.getCount();
    
    // Allow up to 4 confirmed appointments per time slot (based on legacy logic)
    return count < 4;
  }

  async checkPatientDuplicateAppointment(patientId: string, date: Date, excludeId?: string): Promise<boolean> {
    // Note: Patients are now allowed to have multiple appointments per day
    // This method always returns false (no duplicate) to support the new business requirement
    // Time slot conflicts are still prevented by checkTimeSlotAvailability method
    return false;
  }

  async getCurrentPatientAppointment(): Promise<Appointment | undefined> {
    const entities = await this.repository.find({
      order: { appointmentDate: 'ASC', appointmentTime: 'ASC' },
    });

    // Find first non-completed appointment (confirmed or cancelled, but not completed)
    const currentEntity = entities.find(entity => entity.status !== 'completed');
    return currentEntity ? this.toDomain(currentEntity) : undefined;
  }

  private toDomain(entity: AppointmentEntity): Appointment {
    // Convert HH:MM:SS back to HH:MM format if needed
    const timeValue = entity.appointmentTime.includes(':') && entity.appointmentTime.split(':').length === 3
      ? entity.appointmentTime.substring(0, 5) // Extract HH:MM from HH:MM:SS
      : entity.appointmentTime;

    return AppointmentMapper.fromPlainObject({
      id: entity.id,
      patient_id: entity.patientId,
      reason_for_visit: entity.reasonForVisit,
      appointment_date: entity.appointmentDate,
      appointment_time: timeValue,
      status: entity.status,
      doctor_id: entity.doctorId,
      created_at: entity.createdAt,
      updated_at: entity.updatedAt,
    });
  }

  /**
   * Convert appointment with populated patient and doctor data to domain entity
   * This method extends the regular toDomain method to include related entity data
   */
  private toDomainWithRelations(data: AppointmentWithRelations): Appointment {
    const timeValue = data.appointment.appointmentTime.includes(':') && data.appointment.appointmentTime.split(':').length === 3
      ? data.appointment.appointmentTime.substring(0, 5)
      : data.appointment.appointmentTime;

    // Create the appointment domain entity with extended data
    const appointment = AppointmentMapper.fromPlainObject({
      id: data.appointment.id,
      patient_id: data.appointment.patientId,
      reason_for_visit: data.appointment.reasonForVisit,
      appointment_date: data.appointment.appointmentDate,
      appointment_time: timeValue,
      status: data.appointment.status,
      doctor_id: data.appointment.doctorId,
      created_at: data.appointment.createdAt,
      updated_at: data.appointment.updatedAt,
      // Additional populated data
      patient: {
        id: data.patient.id,
        patientNumber: data.patient.patientNumber,
        firstName: data.patient.firstName,
        lastName: data.patient.lastName,
        middleName: data.patient.middleName,
        fullName: `${NameFormattingService.formatToProperCase(data.patient.firstName)}${data.patient.middleName ? ' ' + NameFormattingService.formatToProperCase(data.patient.middleName) : ''} ${NameFormattingService.formatToProperCase(data.patient.lastName)}`.trim(),
      },
      doctor: {
        id: data.doctor.id,
        firstName: data.doctorUser.firstName,
        lastName: data.doctorUser.lastName,
        fullName: `${NameFormattingService.formatToProperCase(data.doctorUser.firstName)} ${NameFormattingService.formatToProperCase(data.doctorUser.lastName)}`.trim(),
        specialization: data.doctor.specialization,
      }
    });

    return appointment;
  }
}
