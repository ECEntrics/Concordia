module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'jest': true
    },
    'extends': [
        'plugin:react/recommended',
        'airbnb'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
        'artifacts': 'readonly',
        'require': 'readonly',
        'contract': 'readonly',
        'assert': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'react'
    ],
    'rules': {
        'import/extensions': 'off',
        'react/require-default-props': 'off',
        'react/prop-types': 'off',
        'max-len': ['warn', {'code': 120, 'tabWidth': 4}],
        'no-unused-vars': 'warn',
        'no-console': 'warn',
        'no-shadow': 'warn',
        'no-multi-str': 'warn',
        'one-var': ["error", {"uninitialized": "always"}],
        'one-var-declaration-per-line': ['error', 'initializations']
    },
    'settings': {
        'import/resolver': {
            'node': {
                'extensions': ['.js']
            }
        }
    },
};
