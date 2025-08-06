import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('prescriptions')
@Index(['patientId', 'status'])
@Index(['doctorId', 'status'])
@Index(['medicationName'])
@Index(['expiryDate', 'status'])
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

  @Column({ type: 'varchar', length: 100 })
  frequency!: string;

  @Column({ type: 'varchar', length: 100 })
  duration!: string;

  @Column({ type: 'datetime', name: 'prescribed_date' })
  prescribedDate!: Date;

  @Column({ type: 'datetime', nullable: true, name: 'expiry_date' })
  expiryDate?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  quantity?: string;

  @Column({ type: 'text', nullable: true, name: 'additional_notes' })
  additionalNotes?: string;

  @Column({ type: 'enum', enum: ['active', 'completed', 'discontinued', 'on-hold'], default: 'active' })
  status!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}