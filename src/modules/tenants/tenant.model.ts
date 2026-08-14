import { Schema, model } from 'mongoose';

const tenantSchema = new Schema(
  {
    companyName: { type: String, required: true, trim: true },
    subdomain: { type: String, required: true, unique: true, lowercase: true, trim: true },
    plan: { type: String, enum: ['FREE', 'PRO'], default: 'FREE' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Tenant = model('Tenant', tenantSchema);