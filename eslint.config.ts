import * as templateParser from '@angular-eslint/template-parser'
import eslint from '@eslint/js'
import angular from 'angular-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import { createRequire } from 'node:module'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

const req = createRequire(import.meta.url)
const eslintScopePath = req.resolve('eslint-scope', { paths: [req.resolve('eslint')] })
const eslintScope = req(eslintScopePath)

const customTemplateParser = {
  ...templateParser,
  parseForESLint(code: string, options?: unknown) {
    const result = templateParser.parseForESLint(code, options as templateParser.ParserOptions)
    if (result && result.ast) {
      if (!result.ast['body']) {
        result.ast['body'] = []
      }
      result.scopeManager = eslintScope.analyze(result.ast, { sourceType: 'module' })
    }
    return result
  },
}

export default defineConfig(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
      eslintPluginPrettierRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      semi: 'off',
      '@typescript-eslint/semi': 0,
      '@typescript-eslint/member-delimiter-style': 0,
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 0,
      '@typescript-eslint/no-unused-vars': ['error'],
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angular.templatePlugin,
    },
    languageOptions: {
      parser: customTemplateParser,
    },
    rules: {
      '@angular-eslint/template/banana-in-box': 'error',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
    },
  },
)
