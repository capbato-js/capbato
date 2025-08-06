import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('fecalysis_results')
export class FecalysisResultEntity {
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

  // Fecalysis specific fields
  @Column({ name: 'color', nullable: true })
  color?: string;

  @Column({ name: 'consistency', nullable: true })
  consistency?: string;

  @Column({ name: 'rbc', nullable: true })
  rbc?: string;

  @Column({ name: 'wbc', nullable: true })
  wbc?: string;

  @Column({ name: 'occult_blood', nullable: true })
  occultBlood?: string;

  @Column({ name: 'urobilinogen', nullable: true })
  urobilinogen?: string;

  @Column({ name: 'others', nullable: true })
  others?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}
