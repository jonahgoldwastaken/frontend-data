const presetEnv = require('postcss-preset-env')
const autoprefixer = require('autoprefixer')
const nested = require('postcss-nested')

module.exports = {
  plugins: [nested(), autoprefixer(), presetEnv()],
}
