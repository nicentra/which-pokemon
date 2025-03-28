import type { Metadata } from 'next';

import { Fira_Code, Fira_Sans } from 'next/font/google';

import './globals.css';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { GameSettings } from '@/components/GameSettings';
import { GitHubLink } from '@/components/GitHubLink';
import { LinkedinLink } from '@/components/LinkedinLink';
import { ThemeProvider } from '@/components/theme-provider';

const firaSans = Fira_Sans({
  variable: '--font-fira-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const firaCode = Fira_Code({
  variable: '--font-fira-code',
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
      <body className={`${firaSans.variable} ${firaCode.variable} font-sans`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <div className='flex flex-col gap-4 p-4'>
            <div className='flex w-full grow flex-row gap-2 border-b'>
              <div className='w-[15%]'>
                <GameSettings />
              </div>
              <h2 className='grow scroll-m-20 pb-2 text-center text-3xl font-semibold tracking-tight first:mt-0'>
                Which Pokemon ...?
              </h2>
              <div className='flex w-[15%] flex-row-reverse'>
                <DarkModeToggle />
                <LinkedinLink />
                <GitHubLink />
              </div>
            </div>
            <div className='flex h-3/4 flex-row gap-2'>
              <div className='w-full'>{children}</div>
            </div>
            <div className='h-3/4 w-full grow'></div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
