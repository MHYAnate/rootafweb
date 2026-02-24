import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-amber-50" />
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="text-center relative z-10 animate-fade-up">
        <div className="mx-auto mb-6 h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Leaf className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-7xl font-bold text-gradient-premium">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-muted-foreground mt-2 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="mt-8 btn-premium rounded-xl gap-2 px-8">
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}