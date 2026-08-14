import { Schema, model, Types } from 'mongoose';

const userSchema = new Schema(
  {
    tenantId: { type: Types.ObjectId, ref: 'Tenant', required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: {
      type: String,
      enum: ['COMPANY_ADMIN', 'WAREHOUSE_MANAGER', 'SALES_STAFF', 'PURCHASE_STAFF', 'ACCOUNTANT'],
      required: true,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Same email can exist in two different tenants — just not twice in the same one.
userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export const User = model('User', userSchema);