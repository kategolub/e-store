'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/@shop/shared/components/ui/tabs';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = pathname.includes('/admin/orders') ? 'orders' : 'products';

  const handleTabChange = (value: string) => {
    router.push(`/admin/${value}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4">
        <div className="flex flex-col">
          <div className="mb-4">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Admin Panel</h1>
          </div>
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
            <TabsList className="bg-zinc-100 p-1 rounded-xl">
              <TabsTrigger value="products" className="px-4 py-2 rounded-lg text-md font-semibold transition-all">
                Products
              </TabsTrigger>
              <TabsTrigger value="orders" className="px-4 py-2 rounded-lg text-md font-semibold transition-all">
                Orders
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {activeTab === 'products' ? (
          <Link
          href="/admin/products/new"
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-md font-medium hover:bg-zinc-800 transition-colors"
        >
          Add Product
        </Link>
        ) : (
          <Link
          href="/admin/orders/new"
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-md font-medium hover:bg-zinc-800 transition-colors"
          onClick={(e) => { e.preventDefault(); /* Disabling button while preparing add new order functionality */}}
        >
          Create Order
        </Link>
        )}
      </div>

      <main>
        {children}
      </main>
    </div>
  );
}
