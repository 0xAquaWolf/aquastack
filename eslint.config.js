import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // Enable TypeScript support
    typescript: true,
    // Enable React support
    react: true,
    // Enable JSX support
    jsx: true,
    // Disable markdown support
    markdown: false,
    // Disable JSONC support
    jsonc: false,
    // Disable YAML support
    yaml: false,
    // Disable TOML support
    toml: false,
  },
  {
    // Override rules for the project
    rules: {
      'no-console': 'off',
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'node/prefer-global/process': 'off',
    },
    // Files to ignore
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/out/**',
      '**/.next/**',
      '**/expo-env.d.ts',
      '**/coverage/**',
      '**/.cache/**',
      '**/public/**',
      'docs/**',
      '.claude/**',
      '.serena/**',
      '.serena/**/*',
    ],
  },
  // Web app specific overrides
  {
    files: ['apps/web/**/*.{js,ts,jsx,tsx}'],
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  // Mobile app specific overrides
  {
    files: ['apps/mobile/**/*.{js,ts,jsx,tsx}'],
    rules: {
      'react/display-name': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  // Shared packages specific overrides
  {
    files: ['packages/**/*.{ts,tsx}'],
    rules: {
      'no-console': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'import-x/no-default-export': 'off',
    },
  },
)
