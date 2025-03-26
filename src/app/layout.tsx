import type { Metadata } from 'next';

import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { GameSettings } from '@/components/GameSettings';
import { GitHubLink } from '@/components/GitHubLink';
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
          <div className='grid grid-cols-[15%_1fr_15%] grid-rows-[5%_1fr_5%] gap-x-2 gap-y-2 p-4'>
            <div className='col-start-2 col-end-3 row-start-1 row-end-2 text-center text-2xl font-bold'>
              Which Pokemon ...?
            </div>
            <div className='col-start-3 col-end-4 row-start-1 row-end-2 text-center text-2xl font-bold'>
              <div className='flex flex-row-reverse'>
                <DarkModeToggle />
                <GitHubLink />
              </div>
            </div>
            <div className='col-start-1 col-end-2 row-start-2 row-end-3 flex flex-col items-center justify-center'></div>
            <div className='col-start-2 col-end-3 row-start-2 row-end-3'>
              {children}
            </div>
            <div className='col-start-3 col-end-4 row-start-2 row-end-3 flex flex-col items-center justify-center'>
              <GameSettings />
            </div>
            <div className='col-start-1 col-end-2 row-start-3 row-end-4'></div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
