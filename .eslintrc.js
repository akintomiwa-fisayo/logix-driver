module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'react/jsx-filename-extension': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/prefer-stateless-function': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'react/destructuring-assignment': 0,
    'react/jsx-props-no-spreading': 0,
    'react/forbid-prop-types': 0,
    'no-underscore-dangle': 0,
    'no-restricted-syntax': 0,
    'guard-for-in': 0,
    'react/no-array-index-key': 0,
    'react/no-unescaped-entities': 0,
    'jsx-a11y/media-has-caption': 0,
    'jsx-a11y/control-has-associated-label': 0,
    'jsx-a11y/anchor-is-valid': 0,
  },
};
