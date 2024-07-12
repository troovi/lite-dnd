import typescript from '@rollup/plugin-typescript'
import terser from '@rollup/plugin-terser'
import strip from '@rollup/plugin-strip'
import { dts } from 'rollup-plugin-dts'

export default [
  // EcmaScript Module (esm) build
  {
    input: './src/index.ts',
    output: {
      file: 'dist/dnd.esm.js',
      format: 'esm',
      globals: { react: 'React', 'react-dom': 'ReactDOM' }
    },
    external: ['react', 'react-dom'],
    plugins: [typescript({ tsconfig: './tsconfig.json' }), strip()]
  },
  // CommonJS (cjs) build
  {
    input: './src/index.ts',
    output: {
      file: 'dist/dnd.cjs.js',
      format: 'cjs',
      globals: { react: 'React', 'react-dom': 'ReactDOM' }
    },
    external: ['react', 'react-dom'],
    plugins: [typescript({ tsconfig: './tsconfig.json' }), strip(), terser()]
  },
  {
    input: 'dist/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    plugins: [dts()]
  }
]
