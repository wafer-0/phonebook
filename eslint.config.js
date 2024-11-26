import globals from 'globals'
import js from '@eslint/js'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'

export default [
    js.configs.recommended,
    eslintPluginPrettier,
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
            },
            ecmaVersion: 'latest',
        },
        rules: {
            'capitalized-comments': ['error', 'always'],
        },
    },
    {
        ignores: ['dist/**', 'build/**'],
    },
]
