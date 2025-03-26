import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { GameSettings } from '@/components/GameSettings';
import { GitHubLink } from '@/components/GitHubLink';
import { LinkedinLink } from '@/components/LinkedinLink';
import { ThemeProvider } from '@/components/theme-provider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Which Pokemon ...?',
  description: 'Fun way to test your pokemon knowledge',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <div className='flex flex-wrap gap-4 p-4'>
            <div className='order-none flex w-full flex-row gap-2'>
              <div className='w-[15%]'></div>
              <div className='grow text-center font-bold'>Which Pokemon ...?</div>
              <div className='flex w-[15%] flex-row-reverse'>
                <DarkModeToggle />
                <LinkedinLink />
                <GitHubLink />
              </div>
            </div>
            <div className='order-1 h-3/4 w-[15%]'></div>
            <div className='order-2 h-3/4'>{children}</div>
            <div className='order-3 flex h-3/4 w-[15%] flex-col gap-2'>
              <GameSettings />
            </div>
            <div className='order-4 h-3/4 w-full'></div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
