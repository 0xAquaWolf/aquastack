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
      'no-console': 'warn',
      'react/display-name': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
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
    files: ['**/*.{js,ts,jsx,tsx}'],
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'perfectionist/sort-imports': 'off',
    },
  },
)
