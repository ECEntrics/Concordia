module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
  ],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'import/extensions': 'off',
    'react/jsx-indent': [
      'error',
      4,
      {
        checkAttributes: true,
        indentLogicalExpressions: true,
      },
    ],
    'react/require-default-props': 'off',
    'react/prop-types': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'max-len': ['warn', { code: 120, tabWidth: 4 }],
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'no-shadow': 'warn',
    'no-multi-str': 'warn',
    'no-underscore-dangle': 0,
    'jsx-a11y/label-has-associated-control': [2, {
      labelAttributes: ['label'],
      controlComponents: ['Input'],
      depth: 3,
    }],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
      },
    },
  },
};
