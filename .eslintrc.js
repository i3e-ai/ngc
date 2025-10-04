// .eslintrc.js
module.exports = {
  root: true,
  extends: ['airbnb-base', 'prettier'],
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }],
    'no-console': 'warn',
    'no-param-reassign': ['error', { props: false }],
    'import/prefer-default-export': 'off',
  },
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
        'react/react-in-jsx-scope': 'off',
        'react/prop-types': 'off',
        'import/extensions': 'off',
      },
    },
  ],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    '*.min.js',
    // Ignore generated bundle outputs from React build step
    'blocks/**/*.js',
    // Ignore build scripts and config files
    'scripts/',
    'vite.config.js',
    // Ignore AEM core files
    'scripts.js',
    'aem.js',
  ],
};
