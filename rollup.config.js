import rollupTypescript from '@rollup/plugin-typescript'
import css from 'rollup-plugin-import-css'
import { eslint } from 'rollup-plugin-eslint'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import pkg from './package.json' assert {type: "json"}

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const paths = {
  input: path.join(__dirname, '/src/index.ts'),
  output: path.join(__dirname, '/lib')
}

export default {
  input: paths.input,
  output: [
    {
      format: 'cjs',
      file: path.join(paths.output, 'index.js'),
      name: pkg.name
    },
    {
      format: 'es',
      file: path.join(paths.output, 'index.esm.js'),
      name: pkg.name
    },
  ],
  plugins: [
    eslint({
      throwOnError: true, // lint 结果有错误将会抛出异常
      throwOnWarning: true,
      include: ['src/**/*.ts'],
      exclude: ['node_modules/**', 'lib/**', '*.js'],
    }),
    css(),
    rollupTypescript()
  ]
}