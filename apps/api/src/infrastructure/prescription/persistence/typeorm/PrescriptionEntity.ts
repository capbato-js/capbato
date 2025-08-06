import {
  Entity,
  PrimaryColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { MedicationEntity } from './MedicationEntity';

@Entity('prescriptions')
@Index(['patientId', 'status'])
@Index(['doctorId', 'status'])
@Index(['expiryDate', 'status'])
export class PrescriptionEntity {
  @PrimaryColumn('varchar')
  id!: string;

  @Column({ type: 'varchar', length: 50, name: 'patient_id' })
  @Index()
  patientId!: string;

  @Column({ type: 'varchar', length: 50, name: 'doctor_id' })
  @Index()
  doctorId!: string;

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

  // Relations
  @OneToMany(() => MedicationEntity, medication => medication.prescription, {
    cascade: true,
    eager: true,
  })
  medications!: MedicationEntity[];
}