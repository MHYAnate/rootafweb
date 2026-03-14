// export const APP_NAME = 'Uplifting Root Artisan Farmers Development Foundation';
// export const APP_SHORT_NAME = 'URAFD';
// export const IT_NUMBER = '8552454';

// export const VERIFICATION_STATUS_MAP: Record<
//   string,
//   { label: string; color: string; bgClass: string; dotColor: string }
// > = {
//   PENDING: {
//     label: 'Pending',
//     color: 'text-amber-700',
//     bgClass: 'bg-amber-50 border-amber-200',
//     dotColor: 'bg-amber-400',
//   },
//   UNDER_REVIEW: {
//     label: 'Under Review',
//     color: 'text-blue-700',
//     bgClass: 'bg-blue-50 border-blue-200',
//     dotColor: 'bg-blue-400',
//   },
//   VERIFIED: {
//     label: 'Verified',
//     color: 'text-emerald-700',
//     bgClass: 'bg-emerald-50 border-emerald-200',
//     dotColor: 'bg-emerald-400',
//   },
//   REJECTED: {
//     label: 'Rejected',
//     color: 'text-red-700',
//     bgClass: 'bg-red-50 border-red-200',
//     dotColor: 'bg-red-400',
//   },
//   SUSPENDED: {
//     label: 'Suspended',
//     color: 'text-gray-700',
//     bgClass: 'bg-gray-50 border-gray-200',
//     dotColor: 'bg-gray-400',
//   },
//   RESUBMITTED: {
//     label: 'Resubmitted',
//     color: 'text-orange-700',
//     bgClass: 'bg-orange-50 border-orange-200',
//     dotColor: 'bg-orange-400',
//   },
// };

// export const PROVIDER_TYPE_MAP: Record<string, { label: string; icon: string }> = {
//   FARMER: { label: 'Farmer', icon: '🌾' },
//   ARTISAN: { label: 'Artisan', icon: '🔨' },
//   BOTH: { label: 'Farmer & Artisan', icon: '🌾🔨' },
// };

// export const PRICING_TYPE_MAP: Record<string, string> = {
//   FIXED: 'Fixed Price',
//   NEGOTIABLE: 'Negotiable',
//   BOTH: 'Price (Negotiable)',
// };

// export const TOOL_CONDITION_MAP: Record<
//   string,
//   { label: string; color: string }
// > = {
//   NEW: { label: 'New', color: 'bg-emerald-50 text-emerald-700' },
//   LIKE_NEW: { label: 'Like New', color: 'bg-green-50 text-green-700' },
//   GOOD: { label: 'Good', color: 'bg-blue-50 text-blue-700' },
//   FAIR: { label: 'Fair', color: 'bg-amber-50 text-amber-700' },
//   FOR_PARTS: { label: 'For Parts', color: 'bg-red-50 text-red-700' },
// };

// export const TOOL_PURPOSE_MAP: Record<string, string> = {
//   FOR_SALE: 'For Sale',
//   FOR_LEASE: 'For Lease',
//   BOTH: 'Sale & Lease',
// };

// export const NIGERIAN_STATES = [
//   'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue',
//   'Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT',
//   'Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi',
//   'Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo',
//   'Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
// ];
export const APP_NAME = 'Uplifting Root Artisan Farmers Development Foundation';
export const APP_SHORT_NAME = 'RootAF';
export const IT_NUMBER = '8552454';

export const VERIFICATION_STATUS_MAP: Record<
  string,
  { label: string; color: string; bgClass: string; dotColor: string }
> = {
  PENDING: {
    label: 'Pending',
    color: 'text-amber-700',
    bgClass: 'bg-amber-50 border-amber-200',
    dotColor: 'bg-amber-400',
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'text-blue-700',
    bgClass: 'bg-blue-50 border-blue-200',
    dotColor: 'bg-blue-400',
  },
  VERIFIED: {
    label: 'Verified',
    color: 'text-emerald-700',
    bgClass: 'bg-emerald-50 border-emerald-200',
    dotColor: 'bg-emerald-400',
  },
  REJECTED: {
    label: 'Rejected',
    color: 'text-red-700',
    bgClass: 'bg-red-50 border-red-200',
    dotColor: 'bg-red-400',
  },
  SUSPENDED: {
    label: 'Suspended',
    color: 'text-gray-700',
    bgClass: 'bg-gray-50 border-gray-200',
    dotColor: 'bg-gray-400',
  },
  RESUBMITTED: {
    label: 'Resubmitted',
    color: 'text-orange-700',
    bgClass: 'bg-orange-50 border-orange-200',
    dotColor: 'bg-orange-400',
  },
};

export const PROVIDER_TYPE_MAP: Record<string, { label: string; icon: string }> = {
  FARMER: { label: 'Farmer', icon: '🌾' },
  ARTISAN: { label: 'Artisan', icon: '🔨' },
  BOTH: { label: 'Farmer & Artisan', icon: '🌾🔨' },
};

/** Helper to get just the label string */
export function getProviderTypeLabel(type: string): string {
  return PROVIDER_TYPE_MAP[type]?.label || type;
}

/** Helper to get icon + label */
export function getProviderTypeDisplay(type: string): string {
  const entry = PROVIDER_TYPE_MAP[type];
  return entry ? `${entry.icon} ${entry.label}` : type;
}

export const PRICING_TYPE_MAP: Record<string, string> = {
  FIXED: 'Fixed Price',
  NEGOTIABLE: 'Negotiable',
  BOTH: 'Price (Negotiable)',
};

export const TOOL_CONDITION_MAP: Record<
  string,
  { label: string; color: string }
> = {
  NEW: { label: 'New', color: 'bg-emerald-50 text-emerald-700' },
  LIKE_NEW: { label: 'Like New', color: 'bg-green-50 text-green-700' },
  GOOD: { label: 'Good', color: 'bg-blue-50 text-blue-700' },
  FAIR: { label: 'Fair', color: 'bg-amber-50 text-amber-700' },
  FOR_PARTS: { label: 'For Parts', color: 'bg-red-50 text-red-700' },
};

export const TOOL_PURPOSE_MAP: Record<string, string> = {
  FOR_SALE: 'For Sale',
  FOR_LEASE: 'For Lease',
  BOTH: 'Sale & Lease',
};

export const TOOL_AVAILABILITY_MAP: Record<string, string> = {
  AVAILABLE: 'Available',
  CURRENTLY_LEASED: 'Currently Leased',
  SOLD: 'Sold',
  RESERVED: 'Reserved',
  UNAVAILABLE: 'Unavailable',
  UNDER_MAINTENANCE: 'Under Maintenance',
};

export const PRODUCT_AVAILABILITY_MAP: Record<string, string> = {
  AVAILABLE: 'Available',
  OUT_OF_STOCK: 'Out of Stock',
  SEASONAL: 'Seasonal',
  LIMITED_STOCK: 'Limited Stock',
  DISCONTINUED: 'Discontinued',
};

export const SERVICE_AVAILABILITY_MAP: Record<string, string> = {
  AVAILABLE: 'Available',
  FULLY_BOOKED: 'Fully Booked',
  BY_APPOINTMENT: 'By Appointment',
  TEMPORARILY_UNAVAILABLE: 'Temporarily Unavailable',
  DISCONTINUED: 'Discontinued',
};

export const CERTIFICATE_TYPE_MAP: Record<string, string> = {
  TRAINING_COMPLETION: 'Training Completion',
  PROFESSIONAL_CERTIFICATION: 'Professional Certification',
  TRADE_LICENSE: 'Trade License',
  AWARD_RECOGNITION: 'Award/Recognition',
  MEMBERSHIP_CERTIFICATE: 'Membership Certificate',
  GOVERNMENT_CERTIFICATION: 'Government Certification',
  SKILL_CERTIFICATION: 'Skill Certification',
  HEALTH_SAFETY_CERT: 'Health & Safety',
  QUALITY_CERTIFICATION: 'Quality Certification',
  OTHER: 'Other',
};

export const EVENT_STATUS_MAP: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  UPCOMING: { label: 'Upcoming', color: 'bg-blue-50 text-blue-700' },
  ONGOING: { label: 'Ongoing', color: 'bg-amber-50 text-amber-700' },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-50 text-emerald-700' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-50 text-red-700' },
  POSTPONED: { label: 'Postponed', color: 'bg-orange-50 text-orange-700' },
};

export const EVENT_TYPE_MAP: Record<string, string> = {
  ANNUAL_GENERAL_MEETING: 'Annual General Meeting',
  BOARD_OF_TRUSTEES_MEETING: 'Board of Trustees Meeting',
  EXECUTIVE_MEETING: 'Executive Meeting',
  SPECIAL_MEETING: 'Special Meeting',
  TRAINING_WORKSHOP: 'Training/Workshop',
  SEMINAR_CONFERENCE: 'Seminar/Conference',
  COMMUNITY_OUTREACH: 'Community Outreach',
  EXHIBITION_FAIR: 'Exhibition/Fair',
  AWARD_CEREMONY: 'Award Ceremony',
  PARTNERSHIP_SIGNING: 'Partnership Signing',
  FUNDRAISING_EVENT: 'Fundraising Event',
  CULTURAL_EVENT: 'Cultural Event',
  LAUNCH_INAUGURATION: 'Launch/Inauguration',
  STAKEHOLDER_MEETING: 'Stakeholder Meeting',
  OTHER: 'Other',
};

export const TESTIMONIAL_CATEGORY_MAP: Record<string, string> = {
  MEMBER_SUCCESS_STORY: 'Member Success Story',
  PARTNER_FEEDBACK: 'Partner Feedback',
  COMMUNITY_IMPACT: 'Community Impact',
  CLIENT_TESTIMONIAL: 'Client Testimonial',
  OFFICIAL_RECOGNITION: 'Official Recognition',
  YOUTH_EMPOWERMENT: 'Youth Empowerment',
  OTHER: 'Other',
};

export const SPONSOR_TYPE_MAP: Record<string, string> = {
  SPONSOR: 'Sponsor',
  PARTNER: 'Partner',
  BOTH: 'Sponsor & Partner',
};

export const SPONSOR_CATEGORY_MAP: Record<string, string> = {
  GOVERNMENT_AGENCY: 'Government Agency',
  NON_GOVERNMENTAL_ORGANIZATION: 'NGO',
  CORPORATE_PRIVATE_SECTOR: 'Corporate/Private Sector',
  INTERNATIONAL_ORGANIZATION: 'International Organization',
  EDUCATIONAL_INSTITUTION: 'Educational Institution',
  TRADITIONAL_INSTITUTION: 'Traditional Institution',
  FINANCIAL_INSTITUTION: 'Financial Institution',
  INDIVIDUAL_DONOR: 'Individual Donor',
  RELIGIOUS_ORGANIZATION: 'Religious Organization',
  MEDIA_ORGANIZATION: 'Media Organization',
  OTHER: 'Other',
};

export const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue',
  'Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT',
  'Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi',
  'Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo',
  'Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
];