'use client';

/** Review centre: recorded performance and the questions still to fix. */
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { McatReviewCenter } from '@/components/test-prep/McatReviewCenter';

export default function McatReviewPage() {
  const params = useParams();
  const router = useRouter();
  const exam = ((params.exam as string) || '').toUpperCase();
  React.useEffect(() => {
    if (exam && exam !== 'MCAT') router.replace(`/dashboard/test-prep/${params.exam}`);
  }, [exam, params.exam, router]);
  if (exam !== 'MCAT') return null;
  return (
    <div className="p-4 sm:p-6 space-y-4 max-w-5xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Review</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your recorded answers only. Nothing here is estimated.
          </p>
        </div>
        <Link href={`/dashboard/test-prep/${String(params.exam).toLowerCase()}`}>
          <Button variant="outline" size="sm" className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" /> MCAT home
          </Button>
        </Link>
      </div>
      <McatReviewCenter />
    </div>
  );
}
