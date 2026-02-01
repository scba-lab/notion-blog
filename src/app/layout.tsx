import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "SCBA.Lab",
    template: "%s | SCBA.Lab",
  },
  description: "Insights on tech careers, supply chain, and life across cultures",
  openGraph: {
    title: "SCBA.Lab",
    description: "Insights on tech careers, supply chain, and life across cultures",
    type: "website",
    url: '/',
    siteName: "SCBA.Lab",
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <header className="site-header">
          <div className="container">
            <a href="/" className="site-logo">
              SCBA.Lab
            </a>
            <nav className="site-nav">
              <a href="/">Home</a>
              <a href="/posts">Posts</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener">
                LinkedIn
              </a>
            </nav>
          </div>
        </header>
        
        <main>{children}</main>
        
        <footer className="site-footer">
          <div className="container">
            <p>© {new Date().getFullYear()} SCBA.Lab. Built with Next.js & Notion.</p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
