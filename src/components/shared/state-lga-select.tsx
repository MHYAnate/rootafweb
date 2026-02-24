'use client';

import { useStates, useLgas } from '@/hooks/use-location';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { MapPin } from 'lucide-react';

interface Props {
  state: string;
  lga: string;
  onStateChange: (state: string) => void;
  onLgaChange: (lga: string) => void;
}

export function StateLgaSelect({
  state,
  lga,
  onStateChange,
  onLgaChange,
}: Props) {
  const { data: statesData } = useStates();
  const { data: lgasData } = useLgas(state);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          State *
        </Label>
        <Select
          value={state}
          onValueChange={(v) => {
            onStateChange(v);
            onLgaChange('');
          }}
        >
          <SelectTrigger className="rounded-lg h-11">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            {statesData?.data?.map((s: any) => (
              <SelectItem key={s.id} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Local Government Area *
        </Label>
        <Select
          value={lga}
          onValueChange={onLgaChange}
          disabled={!state}
        >
          <SelectTrigger className="rounded-lg h-11">
            <SelectValue
              placeholder={
                state ? 'Select LGA' : 'Select state first'
              }
            />
          </SelectTrigger>
          <SelectContent>
            {lgasData?.data?.map((l: any) => (
              <SelectItem key={l.id} value={l.name}>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}