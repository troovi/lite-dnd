// import { nodeResolve } from '@rollup/plugin-node-resolve'
// import babel from 'rollup-plugin-babel';
// import strip from 'rollup-plugin-strip';
// import json from 'rollup-plugin-json';
// import { sizeSnapshot } from 'rollup-plugin-size-snapshot'
import typescript from '@rollup/plugin-typescript'
import strip from '@rollup/plugin-strip'
import { terser } from 'rollup-plugin-terser'

import tsconfig from './tsconfig.json'
// import pkg from './package.json';

const input = './src/index.ts'
const extensions = ['.ts', '.tsx']

// const getBabelOptions = ({ useESModules }) => ({
//   exclude: 'node_modules/**',
//   runtimeHelpers: true,
//   plugins: [['@babel/transform-runtime', { useESModules }]],
// });

export default [
  // Universal module definition (UMD) build
  // - including console.* statements
  // - conditionally used to match snapshot size
  {
    input,
    output: {
      file: 'dist/dnd.js',
      format: 'umd',
      name: 'ReactBeautifulDnd',
      globals: { react: 'React', 'react-dom': 'ReactDOM' }
    },
    // Only deep dependency required is React
    external: ['react', 'react-dom'],
    plugins: [
      typescript({ module: 'esnext' })
      // json(),
      // babel(getBabelOptions({ useESModules: true })),
      // nodeResolve({ extensions })
    ]
  },

  // Minified UMD build
  {
    input,
    output: {
      file: 'dist/dnd.min.js',
      format: 'umd',
      name: 'ReactBeautifulDnd',
      globals: { react: 'React', 'react-dom': 'ReactDOM' }
    },
    // Only deep dependency required is React
    external: ['react', 'react-dom'],
    plugins: [
      // json(),
      // babel(getBabelOptions({ useESModules: true })),
      // resolve({ extensions }),
      typescript({ module: 'esnext' }),
      strip(),
      terser()
    ]
  }

  // // CommonJS (cjs) build
  // // - Keeping console.log statements
  // // - All external packages are not bundled
  // {
  //   input,
  //   output: { file: pkg.main, format: 'cjs' },
  //   plugins: [
  //     json(),
  //     resolve({ extensions }),
  //     babel(getBabelOptions({ useESModules: false })),
  //   ],
  // },

  // // EcmaScript Module (esm) build
  // // - Keeping console.log statements
  // // - All external packages are not bundled
  // {
  //   input,
  //   output: { file: pkg.module, format: 'esm' },
  //   plugins: [
  //     json(),
  //     babel(getBabelOptions({ useESModules: true })),
  //   ],
  // },
]
