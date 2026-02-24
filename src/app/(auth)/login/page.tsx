'use client';

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
import { Loader2, Phone, Lock, Shield } from 'lucide-react';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { useLogin } from '@/hooks/use-auth';

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <Card className="card-premium border-0 shadow-xl animate-scale-in">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription className="mt-1">
          Sign in with your phone number
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form
          onSubmit={handleSubmit((data) => login(data))}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label
              htmlFor="phoneNumber"
              className="flex items-center gap-1.5 text-sm font-medium"
            >
              <Phone className="h-3.5 w-3.5 text-primary" />
              Phone Number
            </Label>
            <Input
              id="phoneNumber"
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
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="flex items-center gap-1.5 text-sm font-medium"
              >
                <Lock className="h-3.5 w-3.5 text-primary" />
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-11 rounded-lg"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 rounded-lg btn-premium"
            disabled={isPending}
          >
            {isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="green-divider" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-3 text-muted-foreground">
              New here?
            </span>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/register"
            className="text-sm text-primary hover:underline font-semibold"
          >
            Create an account →
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Shield className="h-3 w-3" />
            Admin Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}