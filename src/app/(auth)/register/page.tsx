import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ShoppingBag, ArrowRight, Sparkles, Leaf } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="space-y-8 animate-fade-up">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Join URAFD</h1>
        <p className="text-muted-foreground mt-2">
          Choose how you want to be part of our community
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5">
        <Link href="/register/member">
          <Card className="card-premium border-2 hover:border-primary/30 cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <Leaf className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  Join as Member
                  <Sparkles className="h-4 w-4 text-amber-400" />
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  For farmers and artisans who want to list products,
                  services, and tools
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/register/client">
          <Card className="card-premium border-2 hover:border-blue-300/30 cursor-pointer group">
            <CardContent className="p-6 flex items-center gap-5">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                <ShoppingBag className="h-7 w-7 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">
                  Join as Client
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  For customers looking for quality products, services,
                  and tools
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-primary hover:underline font-semibold"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}