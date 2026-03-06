// 'use client';

// import { useCategoriesByType } from '@/hooks/use-categories';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Label } from '@/components/ui/label';
// import { FolderTree } from 'lucide-react';

// interface Props {
//   type: string;
//   value: string;
//   onChange: (value: string) => void;
//   label?: string;
//   placeholder?: string;
// }

// export function CategorySelect({
//   type,
//   value,
//   onChange,
//   label = 'Category',
//   placeholder = 'Select category',
// }: Props) {
//   const { data, isLoading } = useCategoriesByType(type);

//   return (
//     <div className="space-y-2">
//       <Label className="flex items-center gap-1.5">
//         <FolderTree className="h-3.5 w-3.5 text-primary" />
//         {label} *
//       </Label>
//       <Select value={value} onValueChange={onChange} disabled={isLoading}>
//         <SelectTrigger className="h-11 rounded-lg">
//           <SelectValue placeholder={isLoading ? 'Loading...' : placeholder} />
//         </SelectTrigger>
//         <SelectContent>
//           {data?.data?.map((cat: any) => (
//             <SelectItem key={cat.id} value={cat.id}>
//               {cat.name}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }

// src/components/shared/category-select.tsx
'use client';

import { useCategoriesByType } from '@/hooks/use-categories';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, AlertCircle } from 'lucide-react';

interface CategorySelectProps {
  type: string; // 'TOOL' | 'PRODUCT' | 'PRODUCT_AGRICULTURAL' | etc.
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

const GROUP_LABELS: Record<string, string> = {
  TOOL_FARMING: '🌾 Farming Tools',
  TOOL_ARTISAN: '🔨 Artisan Tools',
  PRODUCT_AGRICULTURAL: '🌿 Agricultural Products',
  PRODUCT_ARTISAN: '🎨 Artisan Products',
  SERVICE_FARMING: '🚜 Farming Services',
  SERVICE_ARTISAN: '✂️ Artisan Services',
  FARMER_SPECIALIZATION: '👨‍🌾 Farmer Specializations',
  ARTISAN_SPECIALIZATION: '👷 Artisan Specializations',
};

export function CategorySelect({
  type,
  value,
  onChange,
  label = 'Category',
  placeholder = 'Select a category',
  required = false,
  disabled = false,
}: CategorySelectProps) {
  const { data, isLoading, isError } = useCategoriesByType(type);

  // Works with both old response { data: [...] }
  // and new response { data: [...], grouped: {...} }
  const categories = data?.data || [];
  const grouped = (data?.grouped as Record<string, any[]>) || null;
  const hasGroups = grouped && Object.keys(grouped).length > 1;

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Label>
          {label} {required && '*'}
        </Label>
        <div className="flex items-center gap-2 h-11 px-4 border rounded-lg bg-muted/50">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Loading categories...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-2">
        <Label>
          {label} {required && '*'}
        </Label>
        <div className="flex items-center gap-2 h-11 px-4 border border-destructive/30 rounded-lg bg-destructive/5">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">
            Failed to load categories
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label>
        {label} {required && '*'}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-11 rounded-lg">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {hasGroups
            ? // ── Grouped rendering (composite types like TOOL, PRODUCT) ──
              Object.entries(grouped).map(
                ([groupType, groupCats]: [string, any[]]) => (
                  <SelectGroup key={groupType}>
                    <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {GROUP_LABELS[groupType] || groupType}
                    </SelectLabel>
                    {groupCats.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ),
              )
            : // ── Flat rendering (single type like PRODUCT_AGRICULTURAL) ──
              categories.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}

          {categories.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No categories found
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}