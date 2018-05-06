const buble = require('rollup-plugin-buble')
const filesize = require('rollup-plugin-filesize')
const uglify = require('rollup-plugin-uglify')
const pkg = require('./package.json')

const plugins = [
  buble({
    transforms: {modules: false},
    targets: {ie: 10}
  }),
  uglify(),
  filesize()
]

export default {
  input: 'hover-engine.js',
  output: {
    file: pkg.umd,
    format: 'umd'
  },
  plugins: plugins
}
