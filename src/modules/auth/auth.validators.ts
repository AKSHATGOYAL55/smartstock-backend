import { z } from 'zod';

export const registerSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  subdomain: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;