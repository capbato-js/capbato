import { Doctor } from '../entities/Doctor';

/**
 * Repository interface for Doctor aggregate
 * Following Clean Architecture - Domain layer defines contracts
 * 
 * Note: This repository manages Doctor profiles that are linked to User entities.
 * Use in conjunction with IUserRepository to get complete doctor information.
 */
export interface IDoctorRepository {
  /**
   * Retrieve all active doctor profiles
   */
  getAll(): Promise<Doctor[]>;

  /**
   * Find doctor profile by doctor ID
   */
  getById(id: string): Promise<Doctor | null>;

  /**
   * Find doctor profile by associated user ID
   */
  getByUserId(userId: string): Promise<Doctor | null>;

  /**
   * Find doctor profiles by specialization
   */
  getBySpecialization(specialization: string): Promise<Doctor[]>;

  /**
   * Get all active doctor profiles
   */
  getActiveDoctors(): Promise<Doctor[]>;

  /**
   * Get the count of active doctors
   */
  getActiveCount(): Promise<number>;

  /**
   * Create a new doctor profile (must be linked to existing user with 'doctor' role)
   */
  create(doctor: Doctor): Promise<Doctor>;

  /**
   * Update an existing doctor profile
   */
  update(doctor: Doctor): Promise<Doctor>;

  /**
   * Delete a doctor profile by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Check if doctor profile exists by ID
   */
  exists(id: string): Promise<boolean>;

  /**
   * Check if user already has a doctor profile
   */
  existsByUserId(userId: string): Promise<boolean>;
}
