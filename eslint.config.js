import antfu from '@antfu/eslint-config'

export default await antfu({
  react: true,
  rules: {
    'node/prefer-global/process': 0,
    'curly': ['error', 'all'],
    'no-console': 'warn',
    'unused-imports/no-unused-vars': 'warn',
    'ts/consistent-type-imports': 'off',
    'no-alert': 'off',
  },
})
