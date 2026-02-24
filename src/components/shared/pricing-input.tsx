'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DollarSign } from 'lucide-react';

interface Props {
  pricingType: string;
  onPricingTypeChange: (type: string) => void;
  amount?: number;
  onAmountChange: (amount: number) => void;
  unitLabel?: string;
}

export function PricingInput({
  pricingType,
  onPricingTypeChange,
  amount,
  onAmountChange,
  unitLabel = 'Price Amount',
}: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5">
          <DollarSign className="h-3.5 w-3.5 text-primary" />
          Pricing Type *
        </Label>
        <Select value={pricingType} onValueChange={onPricingTypeChange}>
          <SelectTrigger className="h-11 rounded-lg">
            <SelectValue placeholder="Select pricing" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="FIXED">Fixed Price</SelectItem>
            <SelectItem value="NEGOTIABLE">Negotiable</SelectItem>
            <SelectItem value="BOTH">Fixed (Negotiable)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {pricingType !== 'NEGOTIABLE' && (
        <div className="space-y-2">
          <Label>{unitLabel} (₦)</Label>
          <Input
            type="number"
            placeholder="0.00"
            className="h-11 rounded-lg"
            value={amount || ''}
            onChange={(e) => onAmountChange(Number(e.target.value))}
          />
        </div>
      )}
    </div>
  );
}