import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

const name = 'BsElements';

const basePlugins = [
  resolve({ browser: true, preferBuiltins: false }),
  commonjs(),
];

export default [
  // Bundled: includes bootstrap in the bundle
  {
    input: 'src/index.js',
    plugins: [...basePlugins],
    output: [
      { file: 'dist/bs-elements.bundle.min.js', format: 'iife', name, plugins: [terser()], sourcemap: true },
    ],
  },

  // No-bootstrap build: consumer must load Bootstrap separately (e.g. via CDN)
  {
    input: 'src/index.js',
    external: ['bootstrap'],
    plugins: [...basePlugins],
    output: [
      { file: 'dist/bs-elements.esm.js', format: 'es', sourcemap: true },
      { file: 'dist/bs-elements.min.js', format: 'iife', name, globals: { bootstrap: 'bootstrap' }, plugins: [terser()], sourcemap: true },
    ],
  },
];
