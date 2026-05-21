import js from '@eslint/js';
import globals from 'globals';

export default [
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'public/**',
            '*.log'
        ]
    },

    js.configs.recommended,

    {
        files: ['src/**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
            },
        },
        rules: {
            'no-unused-vars': ['warn', {
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_'
            }],
            'no-console': 'off',
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
        },
    },

    {
        files: ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
        rules: {
            'no-unused-vars': ['warn', {
                'argsIgnorePattern': '^_',
                'varsIgnorePattern': '^_'
            }],
            'semi': ['error', 'always'],
            'quotes': ['error', 'single'],
        }
    },

    {
        files: ['*.mjs', 'eslint.config.mjs'],
        languageOptions: {
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
        },
    }
];