import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Miranda — Intelligence Artificielle Souveraine Régionale',
  description:
    "Miranda est une infrastructure d'IA souveraine conçue from scratch — 18 mois de R&D indépendante, prototype fonctionnel validé.",
  openGraph: {
    title: 'Miranda — Intelligence Artificielle Souveraine Régionale',
    description:
      "Miranda est une infrastructure d'IA souveraine conçue from scratch — 18 mois de R&D indépendante, prototype fonctionnel validé.",
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Miranda — Intelligence Artificielle Souveraine Régionale',
    description:
      "Miranda est une infrastructure d'IA souveraine conçue from scratch — 18 mois de R&D indépendante, prototype fonctionnel validé.",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F5F3EF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        {/* Fonts — Instrument Serif (italic) + Inter as Satoshi fallback */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Satoshi via Fontshare */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap"
          rel="stylesheet"
        />
        {/* Preconnect to video CDN for faster first-paint */}
        <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://d8j0ntlcm91z4.cloudfront.net" />
      </head>
      <body>{children}</body>
    </html>
  );
}
