'use client';
import { Button } from '../../../../client/@shop/shared/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">Product not found</h2>
      <p className="text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </main>
  );
}
