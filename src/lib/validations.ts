import { z } from 'zod';

export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15),
  password: z.string().min(1, 'Password is required'),
});

export const memberRegisterSchema = z
  .object({
    phoneNumber: z
      .string()
      .min(10, 'Phone number must be at least 10 digits'),
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(150),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    providerType: z.enum(['FARMER', 'ARTISAN', 'BOTH']),
    address: z.string().min(5, 'Address is required'),
    localGovernmentArea: z.string().min(2, 'LGA is required'),
    state: z.string().min(2, 'State is required'),
    email: z.string().email().optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const clientRegisterSchema = z
  .object({
    phoneNumber: z
      .string()
      .min(10, 'Phone number must be at least 10 digits'),
    fullName: z.string().min(2, 'Full name is required').max(150),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    state: z.string().optional(),
    localGovernmentArea: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  unitOfMeasure: z.string().min(1, 'Unit is required'),
  pricingType: z.enum(['FIXED', 'NEGOTIABLE', 'BOTH']),
  priceAmount: z.number().optional(),
  pricePerUnit: z.string().optional(),
  availability: z
    .enum([
      'AVAILABLE',
      'OUT_OF_STOCK',
      'SEASONAL',
      'LIMITED_STOCK',
    ])
    .optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2, 'Service name is required'),
  description: z.string().min(10, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  pricingType: z.enum(['FIXED', 'NEGOTIABLE', 'BOTH']),
  startingPrice: z.number().optional(),
  priceBasis: z.string().optional(),
});

export const toolSchema = z.object({
  name: z.string().min(2, 'Tool name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDescription: z.string().optional(),
  categoryId: z.string().min(1, 'Category is required'),
  condition: z.enum(['NEW', 'FAIRLY_USED', 'USED', 'REFURBISHED']),
  brandName: z.string().optional(),
  modelNumber: z.string().optional(),
  quantityAvailable: z.number().int().min(1).optional(),
  listingPurpose: z.enum(['SALE', 'LEASE', 'BOTH']),
  salePricingType: z.enum(['FIXED', 'NEGOTIABLE', 'BOTH']).optional(),
  salePrice: z.number().min(0).optional(),
  leasePricingType: z.enum(['FIXED', 'NEGOTIABLE', 'BOTH']).optional(),
  leaseRate: z.number().min(0).optional(),
  leaseRatePeriod: z.enum(['HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'SEASONAL']).optional(),
  depositRequired: z.enum(['REQUIRED', 'NOT_REQUIRED', 'NEGOTIABLE']).optional(),
  depositAmount: z.number().min(0).optional(),
  pickupLocation: z.string().optional(),
  pickupLocationState: z.string().optional(),
  deliveryAvailable: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export const ratingSchema = z.object({
  memberId: z.string(),
  ratingCategory: z.enum([
    'PRODUCT_RATING',
    'SERVICE_RATING',
    'TOOL_LEASE_RATING',
    'OVERALL_MEMBER',
  ]),
  overallRating: z.number().min(1).max(5),
  reviewText: z.string().max(500).optional(),
});

export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});


export const adminCreateSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  phoneNumber: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  role: z.enum(['SUPER_ADMIN', 'VERIFICATION_ADMIN', 'CONTENT_ADMIN', 'REPORT_ADMIN']),
});

export type AdminCreateFormData = z.infer<typeof adminCreateSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type MemberRegisterFormData = z.infer<typeof memberRegisterSchema>;
export type ClientRegisterFormData = z.infer<typeof clientRegisterSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type ToolFormData = z.infer<typeof toolSchema>;
export type RatingFormData = z.infer<typeof ratingSchema>;
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;