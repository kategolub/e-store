import { Suspense } from 'react';
import OrderConfirmation from '../../../components/order-confirmation/OrderConfirmation';

interface Props {
  params: Promise<{ id: string }>
  searchParams: Promise<{ email?: string }>
}

export default async function OrderConfirmationPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { email } = await searchParams;

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <OrderConfirmation id={id} email={email || ''} />
    </Suspense>
  );
}
