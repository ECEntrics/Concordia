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
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'sourceType': 'module'
    },
    'plugins': [
        'react'
    ],
    'rules': {
        "indent": ["error", 4],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        'react/jsx-filename-extension': 'off',
        'react/jsx-props-no-spreading': 'off',
        'import/extensions': 'off',
        'react/require-default-props': 'off',
        'react/prop-types': 'off',
        'max-len': ['warn', {'code': 120, 'tabWidth': 4}],
        'no-unused-vars': 'warn',
        'no-console': 'warn',
        'no-shadow': 'warn',
    },
    'settings': {
        'import/resolver': {
            'node': {
                'extensions': ['.js', '.jsx']
            }
        }
    },
};
