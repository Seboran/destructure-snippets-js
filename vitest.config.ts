import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'out/**', '**/fake-project/**'],
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
  },
})
