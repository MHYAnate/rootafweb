// ─── API Response Types ───
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── Enums ───
export type UserType = 'MEMBER' | 'CLIENT' | 'ADMIN';
export type VerificationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'RESUBMITTED';
export type ProviderType = 'FARMER' | 'ARTISAN' | 'BOTH';
export type PricingType = 'FIXED' | 'NEGOTIABLE' | 'BOTH';
export type ProductAvailability =
  | 'AVAILABLE'
  | 'OUT_OF_STOCK'
  | 'SEASONAL'
  | 'LIMITED_STOCK'
  | 'DISCONTINUED';
export type ToolCondition =
  | 'NEW'
  | 'LIKE_NEW'
  | 'GOOD'
  | 'FAIR'
  | 'FOR_PARTS';
export type ToolListingPurpose = 'FOR_SALE' | 'FOR_LEASE' | 'BOTH';
export type RatingCategory =
  | 'PRODUCT_RATING'
  | 'SERVICE_RATING'
  | 'TOOL_LEASE_RATING'
  | 'OVERALL_MEMBER';

// ─── Core Types ───
export interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  email?: string;
  userType: UserType;
  verificationStatus: VerificationStatus;
  isActive: boolean;
  createdAt: string;
}

export interface MemberProfile {
  id: string;
  userId: string;
  providerType: ProviderType;
  profilePhotoUrl?: string;
  profilePhotoThumbnail?: string;
  bio?: string;
  tagline?: string;
  address: string;
  localGovernmentArea: string;
  state: string;
  yearsOfExperience?: number;
  averageRating: number;
  totalRatings: number;
  totalProducts: number;
  totalServices: number;
  totalTools: number;
  totalCertificates: number;
  profileViewCount: number;
  user: User;
}

export interface Product {
  id: string;
  memberId: string;
  name: string;
  description: string;
  pricingType: PricingType;
  priceAmount?: number;
  priceDisplayText?: string;
  availability: ProductAvailability;
  averageRating: number;
  viewCount: number;
  images: ProductImage[];
  category: { id: string; name: string };
  member: { id: string; user: { fullName: string } };
}

export interface ProductImage {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  isPrimary: boolean;
}

export interface Service {
  id: string;
  memberId: string;
  name: string;
  description: string;
  pricingType: PricingType;
  startingPrice?: number;
  priceDisplayText?: string;
  availability: string;
  averageRating: number;
  images: any[];
  category: { id: string; name: string };
  member: { id: string; user: { fullName: string } };
}

export interface Tool {
  id: string;
  memberId: string;
  name: string;
  description: string;
  condition: ToolCondition;
  listingPurpose: ToolListingPurpose;
  salePrice?: number;
  leaseRate?: number;
  images: any[];
  category: { id: string; name: string };
  member: { id: string; user: { fullName: string } };
}

export interface Rating {
  id: string;
  overallRating: number;
  reviewTitle?: string;
  reviewText?: string;
  ratingCategory: RatingCategory;
  client: { user: { fullName: string } };
  createdAt: string;
}

export interface Category {
  id: string;
  categoryCode: string;
  categoryType: string;
  name: string;
  description?: string;
  children?: Category[];
}

export interface UploadResult {
  imageUrl: string;
  thumbnailUrl: string;
  mediumUrl: string;
  publicId: string;
  width: number;
  height: number;
  fileSize: number;
}