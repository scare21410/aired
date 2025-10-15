import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import pluginImport from 'eslint-plugin-import';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  prettierConfig,
  {
    plugins: {
      prettier,
      import: pluginImport,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      'prettier/prettier': 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      'import/no-cycle': ['error', { maxDepth: Infinity }], // Rule for detecting import cycles
      'import/no-relative-packages': 'error',
      'import/no-self-import': 'error',
      'import/order': 'error',

      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
  {
    ignores: ['**/node_modules/**', '**/dist/**', '**/.terraform/**'],
  }
);
