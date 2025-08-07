import { Schema, model, Document } from 'mongoose';

export interface IBloodChemistryDocument extends Document {
  _id: string;
  labRequestId?: string;
  patientId: string;
  patientName: string;
  ageGender: string;
  requestDate: Date;
  status: string;
  dateTaken?: Date;
  others?: string;
  
  // Blood Chemistry Tests
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
  
  createdAt: Date;
  updatedAt?: Date;
}

const BloodChemistrySchema = new Schema<IBloodChemistryDocument>(
  {
    labRequestId: {
      type: String,
      required: false,
      index: true,
    },
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
    
    // Blood Chemistry Tests
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
  },
  {
    timestamps: true,
    collection: 'blood_chem',
  }
);

// Indexes for better query performance
BloodChemistrySchema.index({ patientId: 1, requestDate: -1 });
BloodChemistrySchema.index({ status: 1, requestDate: -1 });
BloodChemistrySchema.index({ requestDate: -1 });

export const BloodChemistryModel = model<IBloodChemistryDocument>('BloodChemistry', BloodChemistrySchema);
