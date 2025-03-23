'use client';

import { Button } from './ui/button';
import { SiGithub } from '@icons-pack/react-simple-icons';
import Link from 'next/link';
export function GitHubLink() {
  return (
    <Button
      variant='ghost'
      size='icon'
    >
      <Link
        href='https://github.com/nicentra/which-pokemon'
        target='_blank'
      >
        <SiGithub className='h-4 w-4' />
      </Link>
    </Button>
  );
}
