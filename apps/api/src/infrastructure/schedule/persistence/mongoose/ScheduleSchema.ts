import { Schema, model, Document } from 'mongoose';

export interface IScheduleDocument extends Document {
  _id: string;
  doctorId: string;
  doctorName?: string; // Keep for backward compatibility during migration
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string (HH:MM)
  createdAt: Date;
  updatedAt?: Date;
}

const ScheduleSchema = new Schema<IScheduleDocument>(
  {
    doctorId: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    doctorName: {
      type: String,
      required: false, // Keep for backward compatibility
      maxlength: 100,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD format
    },
    time: {
      type: String,
      required: true,
      match: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, // HH:MM format
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false, // We handle timestamps manually for consistency
    collection: 'schedules',
  }
);

// Create indexes for better query performance
ScheduleSchema.index({ date: 1, time: 1 });
ScheduleSchema.index({ doctorId: 1 });
ScheduleSchema.index({ doctorName: 1 }); // Keep for backward compatibility
ScheduleSchema.index({ date: 1 });

export const ScheduleModel = model<IScheduleDocument>('Schedule', ScheduleSchema);