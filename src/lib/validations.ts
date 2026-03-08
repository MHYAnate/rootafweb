import { z } from 'zod';

// ============================================================================
// AUTH SCHEMAS
// ============================================================================

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

// ============================================================================
// PRODUCT SCHEMA
// ============================================================================

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
    .enum(['AVAILABLE', 'OUT_OF_STOCK', 'SEASONAL', 'LIMITED_STOCK'])
    .optional(),
});

// ============================================================================
// SERVICE SCHEMA
// ============================================================================

export const serviceSchema = z.object({
  name: z.string().min(2, 'Service name is required'),
  description: z.string().min(10, 'Description is required'),
  categoryId: z.string().min(1, 'Category is required'),
  pricingType: z.enum(['FIXED', 'NEGOTIABLE', 'BOTH']),
  startingPrice: z.number().optional(),
  priceBasis: z.string().optional(),
});

// ============================================================================
// TOOL SCHEMA
// ============================================================================
// Prisma ToolCondition:      NEW, LIKE_NEW, GOOD, FAIR, FOR_PARTS
// Prisma ToolListingPurpose: FOR_SALE, FOR_LEASE, BOTH
// Prisma PricingType:        FIXED, NEGOTIABLE, BOTH
// Prisma LeaseRatePeriod:    PER_HOUR, PER_DAY, PER_WEEK, PER_MONTH
// Prisma DepositRequirement: REQUIRED, NOT_REQUIRED, NEGOTIABLE

export const toolSchema = z.object({
  name: z
    .string()
    .min(3, 'Tool name must be at least 3 characters')
    .max(200, 'Tool name must not exceed 200 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description must not exceed 5000 characters'),
  categoryId: z.string().min(1, 'Category is required'),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'FOR_PARTS'], {
    message: 'Condition is required',
  }),
  listingPurpose: z.enum(['FOR_SALE', 'FOR_LEASE', 'BOTH'], {
    message: 'Listing purpose is required',
  }),
  shortDescription: z.string().max(300).optional().or(z.literal('')),
  brandName: z.string().max(100).optional().or(z.literal('')),
  modelNumber: z.string().max(100).optional().or(z.literal('')),
  quantityAvailable: z.preprocess(
    (v) => (v === '' || v === undefined || Number.isNaN(v) ? undefined : Number(v)),
    z.number().int().min(1, 'Quantity must be at least 1').optional(),
  ),
  tags: z.array(z.string()).max(10).optional(),

  // Sale pricing — preprocess NaN to undefined
  salePricingType: z.enum(['FIXED', 'NEGOTIABLE', 'BOTH']).optional(),
  salePrice: z.preprocess(
    (v) => (v === '' || v === undefined || Number.isNaN(v) ? undefined : Number(v)),
    z.number().min(0, 'Price must be positive').optional(),
  ),

  // Lease pricing — preprocess NaN to undefined
  leasePricingType: z.enum(['FIXED', 'NEGOTIABLE', 'BOTH']).optional(),
  leaseRate: z.preprocess(
    (v) => (v === '' || v === undefined || Number.isNaN(v) ? undefined : Number(v)),
    z.number().min(0, 'Lease rate must be positive').optional(),
  ),
  leaseRatePeriod: z
    .enum(['PER_HOUR', 'PER_DAY', 'PER_WEEK', 'PER_MONTH'])
    .optional(),

  // Deposit — preprocess NaN to undefined
  depositRequired: z
    .enum(['REQUIRED', 'NOT_REQUIRED', 'NEGOTIABLE'])
    .optional(),
  depositAmount: z.preprocess(
    (v) => (v === '' || v === undefined || Number.isNaN(v) ? undefined : Number(v)),
    z.number().min(0, 'Deposit must be positive').optional(),
  ),

  // Location
  pickupLocation: z.string().max(500).optional().or(z.literal('')),
  pickupLocationLga: z.string().max(100).optional().or(z.literal('')),
  pickupLocationState: z.string().max(50).optional().or(z.literal('')),

  // Delivery — preprocess NaN to undefined
  deliveryAvailable: z.boolean().optional(),
  deliveryFee: z.preprocess(
    (v) => (v === '' || v === undefined || Number.isNaN(v) ? undefined : Number(v)),
    z.number().min(0).optional(),
  ),
  deliveryNotes: z.string().max(255).optional().or(z.literal('')),
});

// ============================================================================
// RATING SCHEMA
// ============================================================================

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

// ============================================================================
// ADMIN SCHEMAS
// ============================================================================

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
  role: z.enum([
    'SUPER_ADMIN',
    'VERIFICATION_ADMIN',
    'CONTENT_ADMIN',
    'REPORT_ADMIN',
  ]),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type MemberRegisterFormData = z.infer<typeof memberRegisterSchema>;
export type ClientRegisterFormData = z.infer<typeof clientRegisterSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type ToolFormData = z.infer<typeof toolSchema>;
export type RatingFormData = z.infer<typeof ratingSchema>;
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
export type AdminCreateFormData = z.infer<typeof adminCreateSchema>;