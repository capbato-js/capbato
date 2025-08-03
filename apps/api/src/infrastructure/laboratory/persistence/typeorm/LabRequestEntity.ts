import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('lab_request_entries')
export class LabRequestEntity {
  @PrimaryColumn('varchar')
  id!: string;

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

  // Basic Tests
  @Column({ name: 'cbc_with_platelet', nullable: true })
  cbcWithPlatelet?: string;

  @Column({ name: 'pregnancy_test', nullable: true })
  pregnancyTest?: string;

  @Column({ name: 'urinalysis', nullable: true })
  urinalysis?: string;

  @Column({ name: 'fecalysis', nullable: true })
  fecalysis?: string;

  @Column({ name: 'occult_blood_test', nullable: true })
  occultBloodTest?: string;

  // Hepatitis Tests
  @Column({ name: 'hepa_b_screening', nullable: true })
  hepaBScreening?: string;

  @Column({ name: 'hepa_a_screening', nullable: true })
  hepaAScreening?: string;

  @Column({ name: 'hepatitis_profile', nullable: true })
  hepatitisProfile?: string;

  // STD Tests
  @Column({ name: 'vdrl_rpr', nullable: true })
  vdrlRpr?: string;

  // Other Tests
  @Column({ name: 'dengue_ns1', nullable: true })
  dengueNs1?: string;

  @Column({ name: 'ca_125_cea_psa', nullable: true })
  ca125CeaPsa?: string;

  // Blood Chemistry Results
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

  // Other Tests
  @Column({ name: 'ecg', nullable: true })
  ecg?: string;

  @Column({ name: 't3', nullable: true })
  t3?: string;

  @Column({ name: 't4', nullable: true })
  t4?: string;

  @Column({ name: 'ft3', nullable: true })
  ft3?: string;

  @Column({ name: 'ft4', nullable: true })
  ft4?: string;

  @Column({ name: 'tsh', nullable: true })
  tsh?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
