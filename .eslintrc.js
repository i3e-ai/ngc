module.exports = {
  root: true,
  extends: ['airbnb-base', 'prettier'],
  env: {
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    allowImportExportEverywhere: true,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }], // require js file extensions in imports
    'linebreak-style': ['error', 'unix'], // enforce unix linebreaks
    'no-param-reassign': [2, { props: false }], // allow modifying properties of param
    // Disable common stylistic rules

    'comma-dangle': 'off',
    'max-len': 'off',
    'object-curly-spacing': 'off',
    'array-bracket-spacing': 'off',
    'space-before-function-paren': 'off',
    'keyword-spacing': 'off',
    'space-infix-ops': 'off',
    'eol-last': 'off',
    'no-trailing-spaces': 'off',
    'padded-blocks': 'off',
    'no-multiple-empty-lines': 'off',
    'comma-spacing': 'off',
    'key-spacing': 'off',
    'brace-style': 'off',
    'space-before-blocks': 'off',
    // eslint-disable-next-line no-dupe-keys
    'linebreak-style': 'off',
  },
};
