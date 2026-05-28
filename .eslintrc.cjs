module.exports = {
  root: true,
  env: { 
    browser: true, 
    es2020: true,
    node: true,
    jest: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', '*.config.js', '*.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', '@typescript-eslint', 'react', 'prettier', 'boundaries'],
  settings: {
    react: {
      version: 'detect',
    },
    // TypeScript path alias resolution — used by eslint-plugin-boundaries
    // to resolve @/ imports to their real src/ paths before matching elements.
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
    // ─── Architectural boundaries (Clean Architecture) ───────────────────
    // Patterns are relative to boundaries/root-path (= ./src).
    // Rule: domain ← application ← infrastructure ← app/di ← presentation
    // Dependency arrow means "can import from"; arrows only go inward.
    'boundaries/root-path': './src',
    'boundaries/elements': [
      { type: 'domain',         pattern: 'core/domain/**' },
      { type: 'application',    pattern: 'core/application/**' },
      { type: 'shared',         pattern: 'core/shared/**' },
      { type: 'infrastructure', pattern: 'infrastructure/**' },
      { type: 'app-di',         pattern: 'app/**' },
      { type: 'generated',      pattern: 'generated/**' },
      // legacy paths (migrating in Fase 2 — no dependency restrictions yet)
      // src/graphql/ holds .graphql schema files (not TS) — excluded from boundaries
      { type: 'legacy',         pattern: 'services/**' },
      // presentation (components, hooks, pages, contexts)
      {
        type: 'presentation',
        pattern: ['components/**', 'pages/**', 'hooks/**', 'contexts/**'],
      },
      // shared utilities (no app logic, no React)
      { type: 'utils',   pattern: 'utils/**' },
      { type: 'types',   pattern: 'types/**' },
      { type: 'config',  pattern: 'config/**' },
      { type: 'styles',  pattern: 'styles/**' },
    ],
  },
  rules: {
    // SOLID Principles enforcement
    'max-params': ['error', 3], // Single Responsibility: Limit function parameters
    'max-lines-per-function': ['warn', 50], // Single Responsibility: Limit function size
    'max-depth': ['warn', 4], // Single Responsibility: Limit nesting
    'complexity': ['warn', 10], // Single Responsibility: Limit cyclomatic complexity
    
    // Clean Code rules
    'no-console': 'error', // Use logger from @/utils/logger instead
    'no-debugger': 'error',
    'no-alert': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-new-func': 'error',
    'no-script-url': 'error',
    
    // Naming conventions
    'camelcase': ['error', { properties: 'never' }],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase']
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase']
      },
      {
        selector: 'enum',
        format: ['PascalCase']
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE']
      }
    ],
    
    // TypeScript specific rules
    '@typescript-eslint/no-unused-vars': ['error', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_'
    }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-var-requires': 'error',
    // Disabled: autofix converts value imports to `import type`, breaking enums/runtime values.
    // Re-enable manually once God components are refactored and all imports are audited.
    '@typescript-eslint/consistent-type-imports': 'off',
    
    // React specific rules
    'react/prop-types': 'off', // Using TypeScript instead
    'react/react-in-jsx-scope': 'off', // Not needed in React 17+
    'react/jsx-uses-react': 'off', // Not needed in React 17+
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/no-array-index-key': 'warn',
    'react/no-danger': 'warn',
    'react/no-deprecated': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-find-dom-node': 'error',
    'react/no-is-mounted': 'error',
    'react/no-render-return-value': 'error',
    'react/no-string-refs': 'error',
    'react/no-unescaped-entities': 'warn',
    'react/no-unknown-property': 'error',
    'react/self-closing-comp': 'error',
    'react/sort-comp': 'off', // Conflicts with TypeScript
    'react/sort-prop-types': 'off', // Using TypeScript instead
    
    // Performance rules
    'react/jsx-no-bind': 'warn', // Avoid inline functions in render
    'react/jsx-no-leaked-render': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-sort-default-props': 'off',
    'react/jsx-sort-props': 'off',
    
    // Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // General code quality
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error',
    'prefer-arrow-callback': 'error',
    // Disabled: core rule treats `import type { A }` + `import { B }` from same
    // module as duplicates; TypeScript compiler catches real duplicate imports.
    'no-duplicate-imports': 'off',
    'sort-imports': 'off',

    // Error handling
    'no-throw-literal': 'error',
    'prefer-promise-reject-errors': 'error',

    // Prettier owns all formatting — these rules are intentionally absent:
    // arrow-spacing, no-multiple-empty-lines, eol-last, no-trailing-spaces,
    // comma-dangle, semi, quotes — plugin:prettier/recommended disables them.
    'prettier/prettier': 'error',

    // ─── Architectural dependency rules (Clean Architecture) ─────────────
    // default: 'allow' keeps legacy files unrestricted; only the clean layers
    // get explicit disallow rules. Tighten as Fase 2 migrates each module.
    'boundaries/dependencies': [
      'error',
      {
        default: 'allow',
        rules: [
          // domain is the innermost layer — no outward imports allowed
          {
            from: { type: 'domain' },
            disallow: {
              to: { type: ['application', 'infrastructure', 'app-di', 'presentation', 'legacy'] },
            },
          },
          // use cases depend only on domain/shared — never on infrastructure or UI
          {
            from: { type: 'application' },
            disallow: {
              to: { type: ['infrastructure', 'app-di', 'presentation', 'legacy'] },
            },
          },
          // infrastructure adapters must not reach into the composition root or UI
          {
            from: { type: 'infrastructure' },
            disallow: { to: { type: ['app-di', 'presentation'] } },
          },
          // presentation must go through app/di — never reach infrastructure directly
          {
            from: { type: 'presentation' },
            disallow: { to: { type: 'infrastructure' } },
          },
        ],
      },
    ]
  },
  overrides: [
    // ─── Architectural boundary guards via no-restricted-imports ─────────
    // eslint-plugin-boundaries handles resolved/relative imports.
    // no-restricted-imports covers @/ alias imports (moduleResolution:bundler
    // prevents the TypeScript resolver from working in ESLint).
    {
      // domain: innermost layer — no outward imports
      files: ['src/core/domain/**/*.ts', 'src/core/domain/**/*.tsx'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['@/core/application/**'], message: 'Domain layer must not import from application' },
            { group: ['@/infrastructure/**'],   message: 'Domain layer must not import from infrastructure' },
            { group: ['@/app/**'],              message: 'Domain layer must not import from composition root' },
            { group: ['@/components/**', '@/pages/**', '@/hooks/**', '@/contexts/**'],
              message: 'Domain layer must not import from presentation' },
            { group: ['@/services/**'],         message: 'Domain layer must not import from legacy services' },
          ],
        }],
      },
    },
    {
      // application (use cases): must not touch infrastructure or UI
      files: ['src/core/application/**/*.ts', 'src/core/application/**/*.tsx'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['@/infrastructure/**'],   message: 'Use cases must not import infrastructure — depend on the port interface instead' },
            { group: ['@/app/**'],              message: 'Use cases must not import from composition root' },
            { group: ['@/components/**', '@/pages/**', '@/hooks/**', '@/contexts/**'],
              message: 'Use cases must not import from presentation' },
            { group: ['@/services/**'],         message: 'Use cases must not import from legacy services' },
          ],
        }],
      },
    },
    {
      // infrastructure: adapters must not know about UI or DI root
      files: ['src/infrastructure/**/*.ts', 'src/infrastructure/**/*.tsx'],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['@/app/**'],              message: 'Infrastructure must not import from composition root' },
            { group: ['@/components/**', '@/pages/**', '@/hooks/**', '@/contexts/**'],
              message: 'Infrastructure must not import from presentation' },
          ],
        }],
      },
    },
    {
      // presentation: must go through app/di — never reach infrastructure directly
      files: [
        'src/components/**/*.ts', 'src/components/**/*.tsx',
        'src/pages/**/*.ts',      'src/pages/**/*.tsx',
        'src/hooks/**/*.ts',      'src/hooks/**/*.tsx',
        'src/contexts/**/*.ts',   'src/contexts/**/*.tsx',
      ],
      rules: {
        'no-restricted-imports': ['error', {
          patterns: [
            { group: ['@/infrastructure/**'],
              message: 'Presentation must not import infrastructure directly — use the composition root (app/di) instead' },
          ],
        }],
      },
    },
    {
      files: ['*.test.ts', '*.test.tsx', '*.spec.ts', '*.spec.tsx'],
      env: {
        jest: true
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-console': 'off',
        // describe() callbacks grow with each test case — this is expected
        'max-lines-per-function': 'off',
      }
    },
    {
      files: ['*.config.js', '*.config.ts', 'vite.config.ts'],
      env: {
        node: true
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
};
