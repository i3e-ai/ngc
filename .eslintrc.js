module.exports = {
  root: true,
  // MODIFIED: Swapped 'airbnb-base' for 'airbnb' and added React plugins
  extends: [
    'airbnb', // Use the full Airbnb config which includes React rules
    'plugin:react/jsx-runtime', // For modern React 17+
    'plugin:json/recommended',
    'plugin:xwalk/recommended',
  ],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
    // ADDED: This is crucial for parsing JSX
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  // ADDED: Settings for the React plugin
  // .eslintrc.json
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
      },
      typescript: {
        project: './tsconfig.json',
      },
      alias: {
        map: [['~', path.resolve(__dirname, './src')]],
        extensions: ['.js', '.jsx', '.ts', '.d.ts', '.tsx'],
      },
    },
  },
  rules: {
    // Your existing rules are preserved
    'import/extensions': ['error', { js: 'always' }],
    'linebreak-style': ['error', 'unix'],
    'no-param-reassign': ['error', { props: false }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.config.js', '**/*.config.cjs'] },
    ],
    'no-console': 'off',
  },
  plugins: [
    'react',
    'import', // Make sure import plugin is listed
  ],
  overrides: [
    {
      files: ['**/*.jsx'],
      plugins: ['react', 'react-hooks'],
      extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
      settings: {
        react: {
          version: '19.1',
        },
      },
      rules: {
        'react/react-in-jsx-scope': 'off', // Not needed with automatic JSX runtime
        'react/prop-types': 'off', // Can enable if you want prop validation
        'import/extensions': 'off',
      },
    },
  ],
};
