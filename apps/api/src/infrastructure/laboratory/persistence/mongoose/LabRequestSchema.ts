import { Schema, model, Document } from 'mongoose';

export interface ILabRequestDocument extends Document {
  _id: string;
  patientId: string;
  patientName: string;
  ageGender: string;
  requestDate: Date;
  status: string;
  dateTaken?: Date;
  others?: string;
  
  // Basic Tests
  cbcWithPlatelet?: string;
  pregnancyTest?: string;
  urinalysis?: string;
  fecalysis?: string;
  occultBloodTest?: string;
  
  // Hepatitis Tests
  hepaBScreening?: string;
  hepaAScreening?: string;
  hepatitisProfile?: string;
  
  // STD Tests
  vdrlRpr?: string;
  
  // Other Tests
  dengueNs1?: string;
  ca125CeaPsa?: string;
  
  // Blood Chemistry Results
  fbs?: string;
  bun?: string;
  creatinine?: string;
  bloodUricAcid?: string;
  lipidProfile?: string;
  sgot?: string;
  sgpt?: string;
  alp?: string;
  sodiumNa?: string;
  potassiumK?: string;
  hbalc?: string;
  
  // Other Tests
  ecg?: string;
  t3?: string;
  t4?: string;
  ft3?: string;
  ft4?: string;
  tsh?: string;
  
  createdAt: Date;
  updatedAt?: Date;
}

const LabRequestSchema = new Schema<ILabRequestDocument>(
  {
    patientId: {
      type: String,
      required: true,
      index: true,
    },
    patientName: {
      type: String,
      required: true,
      trim: true,
    },
    ageGender: {
      type: String,
      required: true,
      trim: true,
    },
    requestDate: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'complete', 'cancelled'],
      default: 'pending',
      index: true,
    },
    dateTaken: {
      type: Date,
      required: false,
    },
    others: {
      type: String,
      required: false,
      trim: true,
    },
    
    // Basic Tests
    cbcWithPlatelet: { type: String, required: false, trim: true },
    pregnancyTest: { type: String, required: false, trim: true },
    urinalysis: { type: String, required: false, trim: true },
    fecalysis: { type: String, required: false, trim: true },
    occultBloodTest: { type: String, required: false, trim: true },
    
    // Hepatitis Tests
    hepaBScreening: { type: String, required: false, trim: true },
    hepaAScreening: { type: String, required: false, trim: true },
    hepatitisProfile: { type: String, required: false, trim: true },
    
    // STD Tests
    vdrlRpr: { type: String, required: false, trim: true },
    
    // Other Tests
    dengueNs1: { type: String, required: false, trim: true },
    ca125CeaPsa: { type: String, required: false, trim: true },
    
    // Blood Chemistry Results
    fbs: { type: String, required: false, trim: true },
    bun: { type: String, required: false, trim: true },
    creatinine: { type: String, required: false, trim: true },
    bloodUricAcid: { type: String, required: false, trim: true },
    lipidProfile: { type: String, required: false, trim: true },
    sgot: { type: String, required: false, trim: true },
    sgpt: { type: String, required: false, trim: true },
    alp: { type: String, required: false, trim: true },
    sodiumNa: { type: String, required: false, trim: true },
    potassiumK: { type: String, required: false, trim: true },
    hbalc: { type: String, required: false, trim: true },
    
    // Other Tests
    ecg: { type: String, required: false, trim: true },
    t3: { type: String, required: false, trim: true },
    t4: { type: String, required: false, trim: true },
    ft3: { type: String, required: false, trim: true },
    ft4: { type: String, required: false, trim: true },
    tsh: { type: String, required: false, trim: true },
  },
  {
    timestamps: true,
    collection: 'lab_request_entries',
  }
);

// Indexes for better query performance
LabRequestSchema.index({ patientId: 1, requestDate: -1 });
LabRequestSchema.index({ status: 1, requestDate: -1 });
LabRequestSchema.index({ requestDate: -1 });

export const LabRequestModel = model<ILabRequestDocument>('LabRequest', LabRequestSchema);
