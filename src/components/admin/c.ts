import {
  User,
  Building2,
  Briefcase,
  Users,
  Heart,
  type LucideIcon,
} from 'lucide-react';

// ✅ Keep the full config for components that need the icon
export interface ProviderTypeConfig {
  label: string;
  icon: LucideIcon;
}

export const PROVIDER_TYPE_MAP: Record<string, ProviderTypeConfig> = {
  INDIVIDUAL: { label: 'Individual Provider', icon: User },
  ORGANIZATION: { label: 'Organization', icon: Building2 },
  BUSINESS: { label: 'Business', icon: Briefcase },
  NON_PROFIT: { label: 'Non-Profit', icon: Heart },
  GOVERNMENT: { label: 'Government', icon: Users },
};

// ✅ Helper that always returns a string — safe for rendering
export function getProviderTypeLabel(type: string | undefined | null): string {
  if (!type) return '';
  const config = PROVIDER_TYPE_MAP[type];
  if (!config) return type;
  return config.label;
}

// ✅ Helper that returns the icon component — safe for JSX
export function getProviderTypeIcon(type: string | undefined | null): LucideIcon | null {
  if (!type) return null;
  const config = PROVIDER_TYPE_MAP[type];
  return config?.icon || null;
}