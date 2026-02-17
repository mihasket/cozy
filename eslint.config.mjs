import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import css from '@eslint/css'
import prettier from 'eslint-config-prettier'
import { defineConfig } from 'eslint/config'

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
        plugins: { js },
        extends: ['js/recommended'],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                MAIN_WINDOW_VITE_DEV_SERVER_URL: 'readonly',
                MAIN_WINDOW_VITE_NAME: 'readonly',
            },
        },
    },
    tseslint.configs.recommended,
    pluginVue.configs['flat/recommended'],
    {
        files: ['**/*.{js,ts,vue}'],
        rules: {
            'vue/component-api-style': ['error', ['script-setup', 'composition']], // enforce <script setup>
            'vue/define-macros-order': [
                'error',
                {
                    order: ['defineOptions', 'defineProps', 'defineEmits', 'defineSlots'],
                },
            ],
            'vue/block-lang': ['error', { script: { lang: 'ts' } }], // enforce TypeScript in .vue files
            'vue/no-unused-vars': 'error',
            'vue/prefer-import-from-vue': 'error',

            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    {
        files: ['**/*.css'],
        plugins: { css },
        language: 'css/css',
        extends: ['css/recommended'],
    },
    prettier,
])
