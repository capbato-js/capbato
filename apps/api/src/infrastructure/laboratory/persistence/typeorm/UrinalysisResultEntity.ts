import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('urinalysis_results')
export class UrinalysisResultEntity {
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

  // Urinalysis specific fields
  @Column({ name: 'color', nullable: true })
  color?: string;

  @Column({ name: 'transparency', nullable: true })
  transparency?: string;

  @Column({ name: 'specific_gravity', nullable: true })
  specificGravity?: string;

  @Column({ name: 'ph', nullable: true })
  ph?: string;

  @Column({ name: 'protein', nullable: true })
  protein?: string;

  @Column({ name: 'glucose', nullable: true })
  glucose?: string;

  @Column({ name: 'epithelial_cells', nullable: true })
  epithelialCells?: string;

  @Column({ name: 'red_cells', nullable: true })
  redCells?: string;

  @Column({ name: 'pus_cells', nullable: true })
  pusCells?: string;

  @Column({ name: 'mucus_thread', nullable: true })
  mucusThread?: string;

  @Column({ name: 'amorphous_urates', nullable: true })
  amorphousUrates?: string;

  @Column({ name: 'amorphous_phosphate', nullable: true })
  amorphousPhosphate?: string;

  @Column({ name: 'crystals', nullable: true })
  crystals?: string;

  @Column({ name: 'bacteria', nullable: true })
  bacteria?: string;

  @Column({ name: 'others', nullable: true })
  others?: string;

  @Column({ name: 'pregnancy_test', nullable: true })
  pregnancyTest?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}
