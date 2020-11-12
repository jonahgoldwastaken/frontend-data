module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  exclude: ['.nova', 'config'],
  plugins: [
    [
      '@snowpack/plugin-run-script',
      {
        cmd: 'node parseRDWData.js',
      },
    ],
    ['@snowpack/plugin-postcss', {}],
    [
      '@snowpack/plugin-webpack',
      {
        outputPattern: {
          js: '[name].[hash].js',
          css: '[name].[hash].css',
        },
      },
    ],
  ],
  install: [
    /* ... */
  ],
  installOptions: {
    /* ... */
  },
  devOptions: {
    open: 'none',
  },
  buildOptions: {
    sourceMaps: true,
  },
  proxy: {
    /* ... */
  },
  alias: {
    /* ... */
  },
}
