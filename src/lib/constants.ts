export const APP_NAME = 'Uplifting Root Artisan Farmers Development Foundation';
export const APP_SHORT_NAME = 'URAFD';
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

export const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue',
  'Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT',
  'Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi',
  'Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo',
  'Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara',
];