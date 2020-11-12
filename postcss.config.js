const presetEnv = require('postcss-preset-env')
const autoprefixer = require('autoprefixer')
const nested = require('postcss-nested')
const comment = require('postcss-comment')

module.exports = {
  parser: comment,
  plugins: [nested(), autoprefixer(), presetEnv()],
}
