import minify from 'rollup-plugin-babel-minify';

const outFolder = 'dist';

export default [
  {
    input: 'index.js',
    output: {
      file: `${outFolder}/lumin.min.js`,
      format: 'iife',
      name: 'lumin'
    },
    plugins: [minify({ comments: false })]
  }
];