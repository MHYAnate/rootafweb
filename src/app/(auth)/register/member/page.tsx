'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Leaf, User, Phone, Mail, Lock, MapPin, Briefcase } from 'lucide-react';
import {
  memberRegisterSchema,
  MemberRegisterFormData,
} from '@/lib/validations';
import { useRegisterMember } from '@/hooks/use-auth';
import { StateLgaSelect } from '@/components/shared/state-lga-select';

export default function MemberRegisterPage() {
  const { mutate: registerMember, isPending } = useRegisterMember();
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MemberRegisterFormData>({
    resolver: zodResolver(memberRegisterSchema),
  });

  const onSubmit = (data: MemberRegisterFormData) => {
    const { confirmPassword, ...submitData } = data;
    registerMember(submitData);
  };

  return (
    <Card className="card-premium border-0 shadow-xl animate-scale-in">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto mb-3 h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Leaf className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Register as Member
        </CardTitle>
        <CardDescription className="mt-1">
          Join as a farmer or artisan to showcase your work
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-primary" />
              Full Name *
            </Label>
            <Input
              placeholder="John Doe"
              className="h-11 rounded-lg"
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-primary" />
              Phone Number *
            </Label>
            <Input
              placeholder="08012345678"
              className="h-11 rounded-lg"
              {...register('phoneNumber')}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-destructive">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email (Optional)
            </Label>
            <Input
              type="email"
              placeholder="john@example.com"
              className="h-11 rounded-lg"
              {...register('email')}
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-primary" />
              I am a *
            </Label>
            <Select
              onValueChange={(v) =>
                setValue('providerType', v as any)
              }
            >
              <SelectTrigger className="h-11 rounded-lg">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FARMER">🌾 Farmer</SelectItem>
                <SelectItem value="ARTISAN">🔨 Artisan</SelectItem>
                <SelectItem value="BOTH">
                  🌾🔨 Both Farmer & Artisan
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.providerType && (
              <p className="text-sm text-destructive">
                {errors.providerType.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Address *
            </Label>
            <Textarea
              placeholder="Your full address"
              className="rounded-lg min-h-[80px]"
              {...register('address')}
            />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          <StateLgaSelect
            state={state}
            lga={lga}
            onStateChange={(v) => {
              setState(v);
              setValue('state', v);
            }}
            onLgaChange={(v) => {
              setLga(v);
              setValue('localGovernmentArea', v);
            }}
          />
          {errors.state && (
            <p className="text-sm text-destructive">
              {errors.state.message}
            </p>
          )}

          <div className="green-divider my-2" />

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-primary" />
              Password *
            </Label>
            <Input
              type="password"
              placeholder="Min 8 characters"
              className="h-11 rounded-lg"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              Confirm Password *
            </Label>
            <Input
              type="password"
              placeholder="Repeat password"
              className="h-11 rounded-lg"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl btn-premium text-base"
            disabled={isPending}
          >
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-primary hover:underline font-semibold"
          >
            Sign In
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}