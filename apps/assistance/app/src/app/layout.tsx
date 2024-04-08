import type { Metadata } from 'next';
import { Theme } from '@radix-ui/themes';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import './global.css';
import { Providers } from './providers';
import { Header } from '@wrkspce/shared/ui';

/**
 * The metadata for the site.
 */
const meta = {
  title: 'Assistance',
  description:
    'The primary objective of Assistance is to leverage the power of Artificial Intelligence to drastically improve the efficiency of software development teams.',
};

/**
 * The complete metadata object for the site.
 */
export const metadata: Metadata = {
  ...meta,
  title: {
    default: 'Assistance',
    template: `%s - Assistance`,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  twitter: {
    ...meta,
    card: 'summary_large_image',
    site: '@wrkspce',
  },
  openGraph: {
    ...meta,
    locale: 'en-US',
    type: 'website',
  },
};

// The viewport settings for the site.
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = [{ title: 'Stocks', href: '/stocks' }, { title: 'Project', href: "/project" }, { title: 'Persona', href: '/persona' }];
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <Theme appearance="dark" accentColor="sky" grayColor="slate">
          <Providers
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Header />
              {children}
            </div>
          </Providers>
        </Theme>
      </body>
    </html>
  );
}

/**
 * The runtime version used for the application.
 */
export const runtime = 'edge';
