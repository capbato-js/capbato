import { Schema, model, Document } from 'mongoose';

/**
 * Mongoose User Schema
 * For MongoDB user collection
 */
export interface IUserDocument extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  hashedPassword: string;
  role: string;
  mobile?: string;
  createdAt: Date;
  isDeactivated: boolean;
}

const UserSchema = new Schema<IUserDocument>({
  _id: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    maxlength: 254,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    maxlength: 50,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'doctor', 'receptionist'],
    lowercase: true,
  },
  mobile: {
    type: String,
    required: false,
    maxlength: 20,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeactivated: {
    type: Boolean,
    default: false,
  },
}, {
  collection: 'users',
  timestamps: false, // We handle createdAt manually
});

// Create indexes for better query performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });

export const UserModel = model<IUserDocument>('User', UserSchema);