import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { LabRequestEntity } from './LabRequestEntity';

@Entity('lab_test_results')
@Index(['patientId'])
@Index(['dateTested'])
@Index(['labRequestId'])
export class LabTestResultEntity {
  @PrimaryColumn('varchar', { length: 36 })
  id!: string;

  @Column({ name: 'lab_request_id', type: 'varchar', length: 36 })
  labRequestId!: string;

  @Column({ name: 'patient_id', type: 'varchar', length: 36 })
  patientId!: string;

  @Column({ name: 'date_tested', type: 'date', nullable: true })
  dateTested?: Date;

  @Column({ name: 'examination', type: 'varchar', length: 255, nullable: true })
  examination?: string;

  @Column({ name: 'doctor_id', type: 'varchar', length: 36, nullable: true })
  doctorId?: string;

  // Blood Chemistry Results
  @Column({ name: 'result_blood_fbs', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodFbs?: number;

  @Column({ name: 'result_blood_bun', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodBun?: number;

  @Column({ name: 'result_blood_creatinine', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodCreatinine?: number;

  @Column({ name: 'result_blood_uric_acid', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodUricAcid?: number;

  @Column({ name: 'result_blood_cholesterol', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodCholesterol?: number;

  @Column({ name: 'result_blood_triglycerides', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodTriglycerides?: number;

  @Column({ name: 'result_blood_hdl', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodHdl?: number;

  @Column({ name: 'result_blood_ldl', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodLdl?: number;

  @Column({ name: 'result_blood_vldl', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodVldl?: number;

  @Column({ name: 'result_blood_sodium', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodSodium?: number;

  @Column({ name: 'result_blood_potassium', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodPotassium?: number;

  @Column({ name: 'result_blood_chloride', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodChloride?: number;

  @Column({ name: 'result_blood_calcium', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodCalcium?: number;

  @Column({ name: 'result_blood_sgot', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodSgot?: number;

  @Column({ name: 'result_blood_sgpt', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodSgpt?: number;

  @Column({ name: 'result_blood_rbs', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodRbs?: number;

  @Column({ name: 'result_blood_alk_phosphatase', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodAlkPhosphatase?: number;

  @Column({ name: 'result_blood_total_protein', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodTotalProtein?: number;

  @Column({ name: 'result_blood_albumin', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodAlbumin?: number;

  @Column({ name: 'result_blood_globulin', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodGlobulin?: number;

  @Column({ name: 'result_blood_ag_ratio', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodAgRatio?: number;

  @Column({ name: 'result_blood_total_bilirubin', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodTotalBilirubin?: number;

  @Column({ name: 'result_blood_direct_bilirubin', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodDirectBilirubin?: number;

  @Column({ name: 'result_blood_indirect_bilirubin', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodIndirectBilirubin?: number;

  @Column({ name: 'result_blood_ionised_calcium', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodIonisedCalcium?: number;

  @Column({ name: 'result_blood_magnesium', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodMagnesium?: number;

  @Column({ name: 'result_blood_hba1c', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodHba1c?: number;

  @Column({ name: 'result_blood_ogtt_30mins', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodOgtt30mins?: number;

  @Column({ name: 'result_blood_ogtt_1st_hour', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodOgtt1stHour?: number;

  @Column({ name: 'result_blood_ogtt_2nd_hour', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodOgtt2ndHour?: number;

  @Column({ name: 'result_blood_ogtt_2hours_ppbs', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodOgtt2hoursPpbs?: number;

  @Column({ name: 'result_blood_inor_phosphorus', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultBloodInorPhosphorus?: number;

  // Urinalysis Results
  @Column({ name: 'result_urine_color', type: 'varchar', length: 100, nullable: true })
  resultUrineColor?: string;

  @Column({ name: 'result_urine_transparency', type: 'varchar', length: 100, nullable: true })
  resultUrineTransparency?: string;

  @Column({ name: 'result_urine_specific_gravity', type: 'varchar', length: 50, nullable: true })
  resultUrineSpecificGravity?: string;

  @Column({ name: 'result_urine_ph', type: 'varchar', length: 50, nullable: true })
  resultUrinePh?: string;

  @Column({ name: 'result_urine_protein', type: 'varchar', length: 50, nullable: true })
  resultUrineProtein?: string;

  @Column({ name: 'result_urine_glucose', type: 'varchar', length: 50, nullable: true })
  resultUrineGlucose?: string;

  @Column({ name: 'result_urine_epithelial_cells', type: 'varchar', length: 100, nullable: true })
  resultUrineEpithelialCells?: string;

  @Column({ name: 'result_urine_red_cells', type: 'varchar', length: 50, nullable: true })
  resultUrineRedCells?: string;

  @Column({ name: 'result_urine_pus_cells', type: 'varchar', length: 50, nullable: true })
  resultUrinePusCells?: string;

  @Column({ name: 'result_urine_mucus_thread', type: 'varchar', length: 100, nullable: true })
  resultUrineMucusThread?: string;

  @Column({ name: 'result_urine_amorphous_urates', type: 'varchar', length: 100, nullable: true })
  resultUrineAmorphousUrates?: string;

  @Column({ name: 'result_urine_amorphous_phosphate', type: 'varchar', length: 100, nullable: true })
  resultUrineAmorphousPhosphate?: string;

  @Column({ name: 'result_urine_crystals', type: 'varchar', length: 100, nullable: true })
  resultUrineCrystals?: string;

  @Column({ name: 'result_urine_bacteria', type: 'varchar', length: 100, nullable: true })
  resultUrineBacteria?: string;

  @Column({ name: 'result_urine_others', type: 'varchar', length: 255, nullable: true })
  resultUrineOthers?: string;

  @Column({ name: 'result_urine_pregnancy_test', type: 'varchar', length: 50, nullable: true })
  resultUrinePregnancyTest?: string;

  // Hematology Results
  @Column({ name: 'result_hematology_hematocrit', type: 'varchar', length: 50, nullable: true })
  resultHematologyHematocrit?: string;

  @Column({ name: 'result_hematology_hematocrit_category', type: 'varchar', length: 20, nullable: true })
  resultHematologyHematocritCategory?: string;

  @Column({ name: 'result_hematology_hemoglobin', type: 'varchar', length: 50, nullable: true })
  resultHematologyHemoglobin?: string;

  @Column({ name: 'result_hematology_hemoglobin_category', type: 'varchar', length: 20, nullable: true })
  resultHematologyHemoglobinCategory?: string;

  @Column({ name: 'result_hematology_rbc', type: 'varchar', length: 50, nullable: true })
  resultHematologyRbc?: string;

  @Column({ name: 'result_hematology_wbc', type: 'varchar', length: 50, nullable: true })
  resultHematologyWbc?: string;

  @Column({ name: 'result_hematology_segmenters', type: 'varchar', length: 50, nullable: true })
  resultHematologySegmenters?: string;

  @Column({ name: 'result_hematology_lymphocyte', type: 'varchar', length: 50, nullable: true })
  resultHematologyLymphocyte?: string;

  @Column({ name: 'result_hematology_monocyte', type: 'varchar', length: 50, nullable: true })
  resultHematologyMonocyte?: string;

  @Column({ name: 'result_hematology_basophils', type: 'varchar', length: 50, nullable: true })
  resultHematologyBasophils?: string;

  @Column({ name: 'result_hematology_eosinophils', type: 'varchar', length: 50, nullable: true })
  resultHematologyEosinophils?: string;

  @Column({ name: 'result_hematology_platelet', type: 'varchar', length: 50, nullable: true })
  resultHematologyPlatelet?: string;

  @Column({ name: 'result_hematology_others', type: 'varchar', length: 255, nullable: true })
  resultHematologyOthers?: string;

  // Fecalysis Results
  @Column({ name: 'result_fecal_color', type: 'varchar', length: 100, nullable: true })
  resultFecalColor?: string;

  @Column({ name: 'result_fecal_consistency', type: 'varchar', length: 100, nullable: true })
  resultFecalConsistency?: string;

  @Column({ name: 'result_fecal_rbc', type: 'varchar', length: 50, nullable: true })
  resultFecalRbc?: string;

  @Column({ name: 'result_fecal_wbc', type: 'varchar', length: 50, nullable: true })
  resultFecalWbc?: string;

  @Column({ name: 'result_fecal_occult_blood', type: 'varchar', length: 100, nullable: true })
  resultFecalOccultBlood?: string;

  @Column({ name: 'result_fecal_urobilinogen', type: 'varchar', length: 100, nullable: true })
  resultFecalUrobilinogen?: string;

  @Column({ name: 'result_fecal_others', type: 'varchar', length: 255, nullable: true })
  resultFecalOthers?: string;

  // Serology & Immunology Results (Thyroid Function Tests)
  @Column({ name: 'result_serology_ft3', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultSerologyFt3?: number;

  @Column({ name: 'result_serology_ft4', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultSerologyFt4?: number;

  @Column({ name: 'result_serology_tsh', type: 'decimal', precision: 6, scale: 2, nullable: true })
  resultSerologyTsh?: number;

  // Dengue Duo Results
  @Column({ name: 'result_dengue_igg', type: 'varchar', length: 50, nullable: true })
  resultDengueIgg?: string;

  @Column({ name: 'result_dengue_igm', type: 'varchar', length: 50, nullable: true })
  resultDengueIgm?: string;

  @Column({ name: 'result_dengue_ns1', type: 'varchar', length: 50, nullable: true })
  resultDengueNs1?: string;

  // Electrocardiogram Results
  @Column({ name: 'result_ecg_av', type: 'varchar', length: 100, nullable: true })
  resultEcgAv?: string;

  @Column({ name: 'result_ecg_qrs', type: 'varchar', length: 100, nullable: true })
  resultEcgQrs?: string;

  @Column({ name: 'result_ecg_axis', type: 'varchar', length: 100, nullable: true })
  resultEcgAxis?: string;

  @Column({ name: 'result_ecg_pr', type: 'varchar', length: 100, nullable: true })
  resultEcgPr?: string;

  @Column({ name: 'result_ecg_qt', type: 'varchar', length: 100, nullable: true })
  resultEcgQt?: string;

  @Column({ name: 'result_ecg_st_t', type: 'varchar', length: 100, nullable: true })
  resultEcgStT?: string;

  @Column({ name: 'result_ecg_rhythm', type: 'varchar', length: 100, nullable: true })
  resultEcgRhythm?: string;

  @Column({ name: 'result_ecg_others', type: 'varchar', length: 255, nullable: true })
  resultEcgOthers?: string;

  @Column({ name: 'result_ecg_interpretation', type: 'text', nullable: true })
  resultEcgInterpretation?: string;

  @Column({ name: 'result_ecg_interpreter', type: 'varchar', length: 255, nullable: true })
  resultEcgInterpreter?: string;

  // Coagulation Studies Results
  @Column({ name: 'result_coag_patient_pt', type: 'varchar', length: 50, nullable: true })
  resultCoagPatientPt?: string;

  @Column({ name: 'result_coag_control_pt', type: 'varchar', length: 50, nullable: true })
  resultCoagControlPt?: string;

  @Column({ name: 'result_coag_inr', type: 'varchar', length: 50, nullable: true })
  resultCoagInr?: string;

  @Column({ name: 'result_coag_activity_percent', type: 'varchar', length: 50, nullable: true })
  resultCoagActivityPercent?: string;

  @Column({ name: 'result_coag_patient_ptt', type: 'varchar', length: 50, nullable: true })
  resultCoagPatientPtt?: string;

  @Column({ name: 'result_coag_control_ptt', type: 'varchar', length: 50, nullable: true })
  resultCoagControlPtt?: string;

  // Method and remarks
  @Column({ name: 'remarks', type: 'varchar', length: 500, nullable: true })
  remarks?: string;

  @CreateDateColumn({ 
    name: 'created_at',
    type: 'datetime',
    precision: 6
  })
  createdAt!: Date;

  @UpdateDateColumn({ 
    name: 'updated_at',
    type: 'datetime',
    precision: 6
  })
  updatedAt!: Date;

  // Relationship with LabRequestEntity
  @ManyToOne(() => LabRequestEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lab_request_id' })
  labRequest?: LabRequestEntity;
}
