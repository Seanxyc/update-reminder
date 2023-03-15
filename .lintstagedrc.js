module.exports = {
  '**/*.{ts,tsx}': [() => 'tsc -p tsconfig.json --noEmit', 'eslint --cache --fix'],
  '**/*.{js,jsx}': ['eslint --cache --fix --cache-location ./node_modules/@eslint/.eslintcache/'],
  '**/*.{css,less}': ['stylelint --cache --fix --cache-location ./node_modules/stylelint/.stylelintcache/'],
}
