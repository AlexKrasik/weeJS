import ts from '@rollup/plugin-typescript';

export default {
  input: 'src/Wee.ts',
  output: {
    file: 'dist/wee.js',
    format: 'es'
  },
  plugins: [
    ts({compilerOptions: {lib: ["DOM", "ES2020"], target: "esnext", module: "ES6"}})
  ]
};