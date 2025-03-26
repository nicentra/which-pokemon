/**
 * @filename lint-staged.config.mjs
 * @type {import('lint-staged').Config}
 */
import path from 'path';

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`;

const lintStagedConfig = {
  '*.{js,mjs,jsx,ts,tsx}': ['prettier --write', buildEslintCommand],
  '*.{json,css,scss,md}': ['prettier --write'],
};

export default lintStagedConfig;
