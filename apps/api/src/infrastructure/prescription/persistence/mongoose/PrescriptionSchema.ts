import { Schema, model, Document } from 'mongoose';

export interface IPrescriptionDocument extends Document {
  _id: string;
  patientId: string;
  doctorId: string;
  medicationName: string;
  dosage: string;
  instructions: string;
  prescribedDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  createdAt: Date;
}

const PrescriptionSchema = new Schema<IPrescriptionDocument>(
  {
    patientId: {
      type: String,
      required: true,
      trim: true,
    },
    doctorId: {
      type: String,
      required: true,
      trim: true,
    },
    medicationName: {
      type: String,
      required: true,
      maxlength: 200,
      trim: true,
    },
    dosage: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },
    instructions: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
    prescribedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false, // We handle createdAt manually
    collection: 'prescriptions',
  }
);

// Create indexes for better query performance
PrescriptionSchema.index({ patientId: 1, isActive: 1 });
PrescriptionSchema.index({ doctorId: 1, isActive: 1 });
PrescriptionSchema.index({ medicationName: 1 });
PrescriptionSchema.index({ expiryDate: 1, isActive: 1 });
PrescriptionSchema.index({ createdAt: -1 });
PrescriptionSchema.index({ isActive: 1 });

export const PrescriptionModel = model<IPrescriptionDocument>('Prescription', PrescriptionSchema);