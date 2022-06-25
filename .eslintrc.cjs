/**
 * @type {import("eslint").Linter.Config}
 */
const eslintConfig = {
  root: true,
  env: {
    node: true,
  },
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json', './apps/*/tsconfig.json'],
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'filenames', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    '@typescript-eslint/no-floating-promises': 'off',

    // filenames rules
    'filenames/match-regex': ['error', '^[a-z0-9-]+(\\.spec)?$'],
    'filenames/match-exported': 'off',
    'filenames/no-index': 'off',

    // import rules
    'import/no-unresolved': 'error',
    'import/extensions': [
      'error',
      'ignorePackages',
      { js: 'never', ts: 'never' },
    ],
    'import/order': [
      'error',
      {
        groups: [
          // Enforce a convention in module import order
          'builtin',
          'external',
          'parent',
          'sibling',
          'index',
          'internal',
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: 'apps/*/tsconfig.json',
      },
    },
  },
};

module.exports = eslintConfig;
