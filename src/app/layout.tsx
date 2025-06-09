import './globals.css';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Providers from './providers';
import Navbar from './navbar'

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'LinkedIn Clone',
  description: 'A LinkedIn-like social network built with Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={cn(inter.className, 'min-h-screen bg-gray-50 text-gray-900')}>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
