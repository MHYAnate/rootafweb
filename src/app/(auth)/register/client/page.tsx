'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, ShoppingBag, User, Phone, Mail, Lock } from 'lucide-react';
import { clientRegisterSchema, ClientRegisterFormData } from '@/lib/validations';
import { useRegisterClient } from '@/hooks/use-auth';
import { StateLgaSelect } from '@/components/shared/state-lga-select';

export default function ClientRegisterPage() {
  const { mutate: registerClient, isPending } = useRegisterClient();
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ClientRegisterFormData>({
    resolver: zodResolver(clientRegisterSchema),
  });

  const onSubmit = (data: ClientRegisterFormData) => {
    const { confirmPassword, ...submitData } = data;
    registerClient(submitData);
  };

  return (
    <Card className="card-premium border-0 shadow-xl animate-scale-in">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center">
          <ShoppingBag className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Register as Client</CardTitle>
        <CardDescription>Browse and rate products, services, and tools</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><User className="h-3.5 w-3.5 text-primary" />Full Name *</Label>
            <Input placeholder="Jane Doe" className="h-11 rounded-lg" {...register('fullName')} />
            {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-primary" />Phone Number *</Label>
            <Input placeholder="08012345678" className="h-11 rounded-lg" {...register('phoneNumber')} />
            {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-muted-foreground" />Email (Optional)</Label>
            <Input type="email" className="h-11 rounded-lg" {...register('email')} />
          </div>
          <StateLgaSelect state={state} lga={lga}
            onStateChange={(v) => { setState(v); setValue('state', v); }}
            onLgaChange={(v) => { setLga(v); setValue('localGovernmentArea', v); }} />
          <div className="green-divider" />
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-primary" />Password *</Label>
            <Input type="password" className="h-11 rounded-lg" {...register('password')} />
            {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5"><Lock className="h-3.5 w-3.5 text-muted-foreground" />Confirm Password *</Label>
            <Input type="password" className="h-11 rounded-lg" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl btn-premium text-base" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create Account
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary hover:underline font-semibold">Sign In</Link>
        </p>
      </CardContent>
    </Card>
  );
}