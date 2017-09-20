const babel = require('rollup-plugin-babel')
const filesize = require('rollup-plugin-filesize')
const uglify = require('rollup-plugin-uglify')
const pkg = require('./package.json')

const plugins = [
  babel({
    presets: [
      ['env', {
        modules: false
      }]
    ]
  }),
  uglify(),
  filesize()
]

export default {
  input: 'hover-engine.js',
  output: {
    file: pkg.main,
    format: 'es'
  },
  plugins: plugins,
  sourcemap: true
}
