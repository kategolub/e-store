import Link from 'next/link';
import FooterNav from './FooterNav';

export default function Footer() {
  return (
    <footer className="border-t bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">

          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-lg">MegaShop</h3>
            <p className="text-sm text-zinc-500">
              Premium clothing and accessories for every occasion.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Navigation</h3>
            <FooterNav />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm">Account</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/auth/login" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                Login
              </Link>
              <Link href="/auth/register" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                Register
              </Link>
            </nav>
          </div>

        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} MegaShop. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
