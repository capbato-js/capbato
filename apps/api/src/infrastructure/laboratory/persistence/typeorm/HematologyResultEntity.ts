import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('hematology_results')
export class HematologyResultEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'lab_request_id' })
  labRequestId!: string;

  @Column({ name: 'patient_id' })
  patientId!: string;

  @Column({ name: 'patient_name' })
  patientName!: string;

  @Column({ name: 'age', nullable: true })
  age?: string;

  @Column({ name: 'sex', nullable: true })
  sex?: string;

  @Column({ name: 'date_taken', type: 'timestamp' })
  dateTaken!: Date;

  // Hematology specific fields
  @Column({ name: 'hemoglobin', nullable: true })
  hemoglobin?: string;

  @Column({ name: 'hematocrit', nullable: true })
  hematocrit?: string;

  @Column({ name: 'rbc', nullable: true })
  rbc?: string;

  @Column({ name: 'wbc', nullable: true })
  wbc?: string;

  @Column({ name: 'platelet_count', nullable: true })
  plateletCount?: string;

  @Column({ name: 'neutrophils', nullable: true })
  neutrophils?: string;

  @Column({ name: 'lymphocytes', nullable: true })
  lymphocytes?: string;

  @Column({ name: 'monocytes', nullable: true })
  monocytes?: string;

  @Column({ name: 'eosinophils', nullable: true })
  eosinophils?: string;

  @Column({ name: 'basophils', nullable: true })
  basophils?: string;

  @Column({ name: 'mcv', nullable: true })
  mcv?: string;

  @Column({ name: 'mch', nullable: true })
  mch?: string;

  @Column({ name: 'mchc', nullable: true })
  mchc?: string;

  @Column({ name: 'esr', nullable: true })
  esr?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}
