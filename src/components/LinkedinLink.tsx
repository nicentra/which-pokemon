'use client';

import Link from 'next/link';

import LinkedIn from './icons/LinkedIn';
import { Button } from './ui/button';

export function LinkedinLink() {
  return (
    <Button
      variant='ghost'
      size='icon'
    >
      <Link
        href='https://www.linkedin.com/in/nicentra'
        target='_blank'
      >
        <LinkedIn className='h-4 w-4' />
      </Link>
    </Button>
  );
}
