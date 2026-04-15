import type { Metadata } from 'next';
import './globals.css';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'TideTag — AI-powered coastal monitoring',
  description:
    'Citizen-science coastal monitoring platform: geotagged observations, near-real-time water-quality signals, and computer-vision anomaly detection for healthier coasts.',
  openGraph: {
    title: 'TideTag',
    description:
      'AI-powered coastal monitoring for students, communities, and researchers.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-full flex-col">
        <NavBar />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
