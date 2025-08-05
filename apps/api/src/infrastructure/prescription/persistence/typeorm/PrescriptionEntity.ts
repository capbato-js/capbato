import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('prescriptions')
@Index(['patientId', 'isActive'])
@Index(['doctorId', 'isActive'])
@Index(['medicationName'])
@Index(['expiryDate', 'isActive'])
export class PrescriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', name: 'patient_id' })
  @Index()
  patientId!: string;

  @Column({ type: 'uuid', name: 'doctor_id' })
  @Index()
  doctorId!: string;

  @Column({ type: 'varchar', length: 200, name: 'medication_name' })
  medicationName!: string;

  @Column({ type: 'varchar', length: 100 })
  dosage!: string;

  @Column({ type: 'text' })
  instructions!: string;

  @Column({ type: 'datetime', name: 'prescribed_date' })
  prescribedDate!: Date;

  @Column({ type: 'datetime', nullable: true, name: 'expiry_date' })
  expiryDate?: Date;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}