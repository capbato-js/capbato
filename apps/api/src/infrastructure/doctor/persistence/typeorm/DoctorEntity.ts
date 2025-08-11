import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

/**
 * TypeORM entity for Doctor
 * Represents the database table structure for doctor profiles
 * 
 * This entity stores medical-specific information that extends User entities.
 * Each doctor profile is linked to a User account via userId foreign key.
 */
@Entity('doctors')
export class DoctorEntity {
  @PrimaryColumn('varchar')
  id!: string;

  @Column({ name: 'user_id', type: 'varchar', length: 50 })
  @Index('idx_doctor_user_id', { unique: true }) // Ensure one doctor profile per user
  userId!: string;

  @Column({ name: 'Specialization', type: 'varchar', length: 100 })
  specialization!: string;


  @Column({ name: 'license_number', type: 'varchar', length: 50, nullable: true })
  licenseNumber?: string;

  @Column({ name: 'years_of_experience', type: 'integer', nullable: true })
  yearsOfExperience?: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive!: boolean;

  @Column({ name: 'schedule_pattern', type: 'varchar', length: 20, nullable: true })
  schedulePattern?: string;

  // Note: We don't create a TypeORM relationship to UserEntity to avoid circular dependencies
  // The relationship is managed at the application layer through repositories
}
