import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('blood_chem')
export class BloodChemistryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'patient_id' })
  patientId!: string;

  @Column({ name: 'patient_name' })
  patientName!: string;

  @Column({ name: 'age_gender' })
  ageGender!: string;

  @Column({ name: 'request_date', type: 'datetime' })
  requestDate!: Date;

  @Column({ name: 'status', default: 'pending' })
  status!: string;

  @Column({ name: 'date_taken', type: 'datetime', nullable: true })
  dateTaken?: Date;

  @Column({ name: 'others', nullable: true })
  others?: string;

  // Blood Chemistry Tests
  @Column({ name: 'fbs', nullable: true })
  fbs?: string;

  @Column({ name: 'bun', nullable: true })
  bun?: string;

  @Column({ name: 'creatinine', nullable: true })
  creatinine?: string;

  @Column({ name: 'blood_uric_acid', nullable: true })
  bloodUricAcid?: string;

  @Column({ name: 'lipid_profile', nullable: true })
  lipidProfile?: string;

  @Column({ name: 'sgot', nullable: true })
  sgot?: string;

  @Column({ name: 'sgpt', nullable: true })
  sgpt?: string;

  @Column({ name: 'alp', nullable: true })
  alp?: string;

  @Column({ name: 'sodium_na', nullable: true })
  sodiumNa?: string;

  @Column({ name: 'potassium_k', nullable: true })
  potassiumK?: string;

  @Column({ name: 'hbalc', nullable: true })
  hbalc?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
