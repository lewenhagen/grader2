import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        rules: {
            "no-unused-vars": "warn"
        }
    }
]

/* config file for previous version of eslint
{
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  plugins: [
    'jsdoc'
  ],
  extends: [
    'standard',
    'plugin:jsdoc/recommended'
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
  },
  ignorePatterns: [
    'build/',
    'doc/',
    'dist/',
    'node_modules/'
  ]
}
*/