import type { Metadata, Viewport } from 'next';
import './globals.css';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1670f5',
};

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
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-tide-600 focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <NavBar />
        <main id="main-content" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
        <Footer />
      </body>
    </html>
  );
}
