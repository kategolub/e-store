import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from '../components/layout/Header';
import Providers from '../providers/Providers';
import "./globals.css";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MEGASHOP",
  description: "E-commerce clothing store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <Providers>
          <Header />
          <div className="min-h-screen">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
