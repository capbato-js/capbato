import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { PrescriptionEntity } from './PrescriptionEntity';

@Entity('medications')
@Index(['prescriptionId'])
export class MedicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, name: 'prescription_id' })
  prescriptionId!: string;

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

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // Relations
  @ManyToOne(() => PrescriptionEntity, prescription => prescription.medications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prescription_id' })
  prescription!: PrescriptionEntity;
}
