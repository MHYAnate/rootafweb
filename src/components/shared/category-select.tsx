'use client';

import { useCategoriesByType } from '@/hooks/use-categories';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FolderTree } from 'lucide-react';

interface Props {
  type: string;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

export function CategorySelect({
  type,
  value,
  onChange,
  label = 'Category',
  placeholder = 'Select category',
}: Props) {
  const { data, isLoading } = useCategoriesByType(type);

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-1.5">
        <FolderTree className="h-3.5 w-3.5 text-primary" />
        {label} *
      </Label>
      <Select value={value} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger className="h-11 rounded-lg">
          <SelectValue placeholder={isLoading ? 'Loading...' : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {data?.data?.map((cat: any) => (
            <SelectItem key={cat.id} value={cat.id}>
              {cat.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}