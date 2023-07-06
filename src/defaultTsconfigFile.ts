export const defaultTsconfigFile = {
  compilerOptions: {
    target: 'es5',
    module: 'commonjs',
    allowJs: true,
    checkJs: true,
    strict: true,
    noImplicitAny: true,
    esModuleInterop: true,
  },
  include: ['src/**/*.ts', 'src/**/*.js'],
  exclude: ['node_modules'],
}
