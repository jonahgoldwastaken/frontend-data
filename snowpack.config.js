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
    ['@snowpack/plugin-optimize', {}],
  ],
  install: [
    /* ... */
  ],
  installOptions: {
    /* ... */
  },
  devOptions: {
    open: 'none',
    hmr: false,
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
