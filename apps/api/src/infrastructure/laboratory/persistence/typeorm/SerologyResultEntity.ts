import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('serology_results')
export class SerologyResultEntity {
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

  // Serology specific fields
  @Column({ name: 'vdrl', nullable: true })
  vdrl?: string;

  @Column({ name: 'rpr', nullable: true })
  rpr?: string;

  @Column({ name: 'hbsag', nullable: true })
  hbsag?: string;

  @Column({ name: 'anti_hcv', nullable: true })
  antiHcv?: string;

  @Column({ name: 'hiv_test', nullable: true })
  hivTest?: string;

  @Column({ name: 'pregnancy_test', nullable: true })
  pregnancyTest?: string;

  @Column({ name: 'dengue_ns1', nullable: true })
  dengueNs1?: string;

  @Column({ name: 'dengue_tourniquet', nullable: true })
  dengueTourniquet?: string;

  @Column({ name: 'weil_felix', nullable: true })
  weilFelix?: string;

  @Column({ name: 'typhidot', nullable: true })
  typhidot?: string;

  @Column({ name: 'blood_type', nullable: true })
  bloodType?: string;

  @Column({ name: 'rh_factor', nullable: true })
  rhFactor?: string;

  @Column({ name: 'others', nullable: true })
  others?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;
}
