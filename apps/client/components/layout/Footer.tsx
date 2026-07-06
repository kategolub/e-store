import Link from 'next/link';
import FooterNav from './FooterNav';
import FooterAccountLinks from './FooterAccountLinks';
import { useAuth } from '@/hooks/useAuth';

export default function Footer() {  
  return (
    <footer className="border-t bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg">MEGASHOP</h3>
            <p className="text-sm text-zinc-500">
              Premium clothing and accessories for every occasion.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Navigation</h3>
            <FooterNav />
          </div>
          <FooterAccountLinks />
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} MEGASHOP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
