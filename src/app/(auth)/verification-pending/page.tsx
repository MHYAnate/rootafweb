import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function VerificationPendingPage() {
  return (
    <Card className="card-premium border-0 shadow-xl text-center animate-scale-in">
      <CardHeader className="pb-2">
        <div className="mx-auto mb-4 h-20 w-20 rounded-3xl bg-amber-50 flex items-center justify-center animate-glow">
          <Clock className="h-10 w-10 text-amber-500" />
        </div>
        <CardTitle className="text-2xl font-bold">
          Verification Pending
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground max-w-sm mx-auto">
          Your registration has been submitted successfully. An
          administrator will review and verify your account shortly.
        </p>

        <div className="bg-muted/50 rounded-2xl p-5 text-left space-y-3.5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </div>
            <span className="text-sm font-medium">
              Registration submitted
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0 animate-pulse">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <span className="text-sm font-medium">
              Awaiting admin verification
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
            <span className="text-sm text-muted-foreground">
              Full access after verification
            </span>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-sm text-blue-700">
            💡 This usually takes 1-2 business days. You'll be notified
            once your account is verified.
          </p>
        </div>

        <Link href="/login">
          <Button
            variant="outline"
            className="w-full rounded-xl h-11 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}