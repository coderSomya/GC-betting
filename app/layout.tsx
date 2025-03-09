import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import BottomNavigation from '@/components/BottomNavigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Next.js App',
  description: 'A simple Next.js app with bottom navigation',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen pb-16">
          {children}
        </main>
        <BottomNavigation />
      </body>
    </html>
  );
}