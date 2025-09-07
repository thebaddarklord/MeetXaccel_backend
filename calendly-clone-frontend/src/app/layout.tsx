import type { Metadata } from 'next';
import { Providers } from '@/lib/providers';
import { NotificationSystem } from '@/components/ui/NotificationSystem';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export const metadata: Metadata = {
  title: 'Calendly Clone - Professional Scheduling Platform',
  description: 'Enterprise-grade scheduling platform for professionals and teams',
  keywords: 'scheduling, calendar, booking, appointments, meetings, enterprise',
  authors: [{ name: 'Calendly Clone Team' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'Calendly Clone - Professional Scheduling Platform',
    description: 'Enterprise-grade scheduling platform for professionals and teams',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calendly Clone - Professional Scheduling Platform',
    description: 'Enterprise-grade scheduling platform for professionals and teams',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
      </head>
      <body>
        <ErrorBoundary>
          <Providers>
            {children}
            <NotificationSystem />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}