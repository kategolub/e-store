import Link from 'next/link';
import { Button } from '../../../../client/@shop/shared/components/ui/button';

export default function NotFound() {
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">Product not found</h2>
      <p className="text-muted-foreground">
        The product you are looking for does not exist.
      </p>
      <Button asChild>
        <Link href="/products">Back to products</Link>
      </Button>
    </main>
  );
}
