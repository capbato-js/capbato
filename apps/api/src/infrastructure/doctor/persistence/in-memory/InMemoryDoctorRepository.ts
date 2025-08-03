import { injectable } from 'tsyringe';
import { Doctor, IDoctorRepository } from '@nx-starter/domain';
import { generateId } from '@nx-starter/utils-core';

/**
 * In-memory implementation of IDoctorRepository
 * Useful for testing and development
 * 
 * This implementation manages doctor profiles that are linked to User entities
 * via userId relationships.
 */
@injectable()
export class InMemoryDoctorRepository implements IDoctorRepository {
  private doctors: Map<string, Doctor> = new Map();
  private userIdIndex: Map<string, string> = new Map(); // userId -> doctorId

  constructor() {
    // Seed with some sample data
    this.seedData();
  }

  async getAll(): Promise<Doctor[]> {
    return Array.from(this.doctors.values());
  }

  async getById(id: string): Promise<Doctor | null> {
    return this.doctors.get(id) || null;
  }

  async getByUserId(userId: string): Promise<Doctor | null> {
    const doctorId = this.userIdIndex.get(userId);
    return doctorId ? this.doctors.get(doctorId) || null : null;
  }

  async existsByUserId(userId: string): Promise<boolean> {
    return this.userIdIndex.has(userId);
  }

  async getActiveDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values()).filter(
      doctor => doctor.isActive
    );
  }

  async getBySpecialization(specialization: string): Promise<Doctor[]> {
    return Array.from(this.doctors.values()).filter(
      doctor => doctor.specializationValue === specialization
    );
  }

  async create(doctor: Doctor): Promise<Doctor> {
    const id = generateId();
    
    // Check if user already has a doctor profile
    if (this.userIdIndex.has(doctor.userId)) {
      throw new Error(`User ${doctor.userId} already has a doctor profile`);
    }
    
    const newDoctor = new Doctor(
      doctor.userId,
      doctor.specializationValue,
      id,
      doctor.licenseNumber,
      doctor.yearsOfExperience,
      doctor.isActive
    );
    
    this.doctors.set(id, newDoctor);
    this.userIdIndex.set(doctor.userId, id);
    return newDoctor;
  }

  async update(doctor: Doctor): Promise<Doctor> {
    if (!doctor.stringId) {
      throw new Error('Doctor profile ID is required for update operation');
    }

    if (!this.doctors.has(doctor.stringId)) {
      throw new Error(`Doctor profile with ID ${doctor.stringId} not found`);
    }

    this.doctors.set(doctor.stringId, doctor);
    return doctor;
  }

  async delete(id: string): Promise<void> {
    const doctor = this.doctors.get(id);
    if (doctor) {
      this.userIdIndex.delete(doctor.userId);
    }
    this.doctors.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    return this.doctors.has(id);
  }

  /**
   * Clear all doctors (useful for testing)
   */
  clear(): void {
    this.doctors.clear();
    this.userIdIndex.clear();
  }

  /**
   * Seed repository with sample data
   * Note: These use sample user IDs that should correspond to existing users
   */
  private seedData(): void {
    const sampleDoctors = [
      new Doctor('user-doctor-1', 'General Practice', generateId(), 'MD-12345', 10, true),
      new Doctor('user-doctor-2', 'Cardiology', generateId(), 'MD-23456', 15, true),
      new Doctor('user-doctor-3', 'Pediatrics', generateId(), 'MD-34567', 8, true),
      new Doctor('user-doctor-4', 'Orthopedics', generateId(), 'MD-45678', 12, true),
      new Doctor('user-doctor-5', 'Neurology', generateId(), 'MD-56789', 20, false), // Inactive
    ];

    sampleDoctors.forEach(doctor => {
      if (doctor.stringId) {
        this.doctors.set(doctor.stringId, doctor);
        this.userIdIndex.set(doctor.userId, doctor.stringId);
      }
    });
  }
}
