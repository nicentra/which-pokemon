import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: eslint.configs.recommended,
});

const eslintConfig = [
  ...compat.config({
    extends: [
      'plugin:import/recommended',
      'plugin:import/typescript',
      'next/core-web-vitals',
      'next/typescript',
    ],
    rules: {
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', next: 'import', prev: '*' },
        { blankLine: 'any', next: 'import', prev: 'import' },
        { blankLine: 'always', next: 'const', prev: '*' },
        { blankLine: 'always', next: '*', prev: 'const' },
        { blankLine: 'any', next: 'const', prev: 'const' },
        { blankLine: 'always', next: 'let', prev: '*' },
        { blankLine: 'always', next: '*', prev: 'let' },
        { blankLine: 'any', next: 'let', prev: 'let' },
        { blankLine: 'always', next: 'export', prev: '*' },
        { blankLine: 'always', next: '*', prev: 'export' },
        { blankLine: 'any', next: 'export', prev: 'export' },
        { blankLine: 'always', next: 'return', prev: '*' },
        {
          blankLine: 'any',
          next: 'return',
          prev: ['function', 'if', 'try', 'while', 'for', 'switch'],
        },
      ],

      'react/prop-types': 'off',

      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],
      'import/first': 'error',
      'import/no-named-as-default': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'type', // <- Type imports (e.g. import type { ReactNode } from 'react')
            'builtin', // <- Built-in imports (e.g. import { useState } from 'react')
            'external', // <- External imports (e.g. import { useState } from 'react')
            'internal', // <- Internal imports (e.g. import { useState } from '../components')
            ['sibling', 'parent'], // <- Parent and sibling imports (e.g. import { useState } from '../components/Button')
            'index', // <- index imports (e.g. import { useState } from '../components')
            'unknown', // <- unknown imports (e.g. import { useState } from 'react')
          ],
          'newlines-between': 'always',
          alphabetize: {
            /* sort in ascending order. Options: ['asc', 'desc', 'ignore'] */
            order: 'asc',
            /* ignore case. Options: ['ignore', 'asc', 'desc'] */
            caseInsensitive: true,
          },
        },
      ],
    },
  }),
  eslintConfigPrettier,
];

export default eslintConfig;
