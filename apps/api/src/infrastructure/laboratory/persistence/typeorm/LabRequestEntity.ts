import { Entity, PrimaryColumn, Column, Index } from 'typeorm';

@Entity('lab_requests')
@Index(['patientId'])
@Index(['requestDate'])
@Index(['status'])
export class LabRequestEntity {
  @PrimaryColumn('varchar', { length: 36 })
  id!: string;

  @Column({ name: 'patient_id', type: 'varchar', length: 36 })
  patientId!: string;

  @Column({ name: 'request_date', type: 'date' })
  requestDate!: Date;

  @Column({ 
    name: 'status', 
    type: 'enum', 
    enum: ['pending', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  })
  status!: 'pending' | 'in_progress' | 'completed' | 'cancelled';

  @Column({ name: 'date_taken', type: 'date', nullable: true })
  dateTaken?: Date;

  // ROUTINE Tests
  @Column({ name: 'routine_cbc_with_platelet', type: 'boolean', default: false })
  routineCbcWithPlatelet!: boolean;

  @Column({ name: 'routine_pregnancy_test', type: 'boolean', default: false })
  routinePregnancyTest!: boolean;

  @Column({ name: 'routine_urinalysis', type: 'boolean', default: false })
  routineUrinalysis!: boolean;

  @Column({ name: 'routine_fecalysis', type: 'boolean', default: false })
  routineFecalysis!: boolean;

  @Column({ name: 'routine_occult_blood_test', type: 'boolean', default: false })
  routineOccultBloodTest!: boolean;

  // SEROLOGY & IMMUNOLOGY Tests
  @Column({ name: 'serology_hepatitis_b_screening', type: 'boolean', default: false })
  serologyHepatitisBScreening!: boolean;

  @Column({ name: 'serology_hepatitis_a_screening', type: 'boolean', default: false })
  serologyHepatitisAScreening!: boolean;

  @Column({ name: 'serology_hepatitis_c_screening', type: 'boolean', default: false })
  serologyHepatitisCScreening!: boolean;

  @Column({ name: 'serology_hepatitis_profile', type: 'boolean', default: false })
  serologyHepatitisProfile!: boolean;

  @Column({ name: 'serology_vdrl_rpr', type: 'boolean', default: false })
  serologyVdrlRpr!: boolean;

  @Column({ name: 'serology_crp', type: 'boolean', default: false })
  serologyCrp!: boolean;

  @Column({ name: 'serology_dengue_ns1', type: 'boolean', default: false })
  serologyDengueNs1!: boolean;

  @Column({ name: 'serology_aso', type: 'boolean', default: false })
  serologyAso!: boolean;

  @Column({ name: 'serology_crf', type: 'boolean', default: false })
  serologyCrf!: boolean;

  @Column({ name: 'serology_ra_rf', type: 'boolean', default: false })
  serologyRaRf!: boolean;

  @Column({ name: 'serology_tumor_markers', type: 'boolean', default: false })
  serologyTumorMarkers!: boolean;

  @Column({ name: 'serology_ca_125', type: 'boolean', default: false })
  serologyCa125!: boolean;

  @Column({ name: 'serology_cea', type: 'boolean', default: false })
  serologyCea!: boolean;

  @Column({ name: 'serology_psa', type: 'boolean', default: false })
  serologyPsa!: boolean;

  @Column({ name: 'serology_beta_hcg', type: 'boolean', default: false })
  serologyBetaHcg!: boolean;

  // BLOOD CHEMISTRY Tests
  @Column({ name: 'blood_chemistry_fbs', type: 'boolean', default: false })
  bloodChemistryFbs!: boolean;

  @Column({ name: 'blood_chemistry_bun', type: 'boolean', default: false })
  bloodChemistryBun!: boolean;

  @Column({ name: 'blood_chemistry_creatinine', type: 'boolean', default: false })
  bloodChemistryCreatinine!: boolean;

  @Column({ name: 'blood_chemistry_blood_uric_acid', type: 'boolean', default: false })
  bloodChemistryBloodUricAcid!: boolean;

  @Column({ name: 'blood_chemistry_lipid_profile', type: 'boolean', default: false })
  bloodChemistryLipidProfile!: boolean;

  @Column({ name: 'blood_chemistry_sgot', type: 'boolean', default: false })
  bloodChemistrySgot!: boolean;

  @Column({ name: 'blood_chemistry_sgpt', type: 'boolean', default: false })
  bloodChemistrySgpt!: boolean;

  @Column({ name: 'blood_chemistry_alkaline_phosphatase', type: 'boolean', default: false })
  bloodChemistryAlkalinePhosphatase!: boolean;

  @Column({ name: 'blood_chemistry_sodium', type: 'boolean', default: false })
  bloodChemistrySodium!: boolean;

  @Column({ name: 'blood_chemistry_potassium', type: 'boolean', default: false })
  bloodChemistryPotassium!: boolean;

  @Column({ name: 'blood_chemistry_hba1c', type: 'boolean', default: false })
  bloodChemistryHba1c!: boolean;

  // MISCELLANEOUS TEST
  @Column({ name: 'misc_ecg', type: 'boolean', default: false })
  miscEcg!: boolean;

  // THYROID Function Test
  @Column({ name: 'thyroid_t3', type: 'boolean', default: false })
  thyroidT3!: boolean;

  @Column({ name: 'thyroid_t4', type: 'boolean', default: false })
  thyroidT4!: boolean;

  @Column({ name: 'thyroid_ft3', type: 'boolean', default: false })
  thyroidFt3!: boolean;

  @Column({ name: 'thyroid_ft4', type: 'boolean', default: false })
  thyroidFt4!: boolean;

  @Column({ name: 'thyroid_tsh', type: 'boolean', default: false })
  thyroidTsh!: boolean;

  // Custom/Other tests
  @Column({ name: 'others', type: 'text', nullable: true })
  others?: string;

  @Column({ 
    name: 'created_at', 
    type: 'datetime', 
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt!: Date;

  @Column({ 
    name: 'updated_at', 
    type: 'datetime', 
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP'
  })
  updatedAt!: Date;
}
