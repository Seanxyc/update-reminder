module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  overrides: [
    // 处理 JS 文件
    {
      files: ['**/*.{js,jsx}'], // 只处理 js 和 jsx 文件
      parserOptions: {
        sourceType: 'module', // 支持 import/export
        allowImportExportEverywhere: false,
        ecmaFeatures: {
          globalReturn: false,
        },
      },
    },
    // 处理 TS 文件
    {
      files: ['**/*.{ts,tsx}'], // 只处理 ts 和 js 文件
      excludedFiles: ['vitest.config.ts'],
      parser: '@typescript-eslint/parser', // 能看懂 TypeScript
      parserOptions: {
        project: ['tsconfig.json'],
      },
      extends: [
        // typescript-eslint 的推荐规则，只是这些最佳规则都是针对 TS 的
        'plugin:@typescript-eslint/recommended',
        // tsconfig.json 里 Type Checking 的推荐规则
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      plugins: [
        // 使用 typescript x eslint 的插件
        '@typescript-eslint',
      ],
      rules: {
        'max-len': ['error', { code: 120 }],
        '@typescript-eslint/no-unsafe-argument': 0,
        '@typescript-eslint/no-unsafe-assignment': 0,
        '@typescript-eslint/no-unsafe-member-access': 0,
        '@typescript-eslint/restrict-template-expressions': 0,
        '@typescript-eslint/no-empty-function': 0,
        '@typescript-eslint/no-unsafe-call': 0,
      },
    },
  ],
}
