module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'vitessce',
      externals: {
        react: 'React'
      }
    }
  },
  webpack: {
    html: {
      template: 'demo/src/index.html',
    },
    extractCSS: {
      filename: '[name].css'
    },
    rules: {
      svg: {
        loader: '@svgr/webpack',
      },
      sass: {
        modules: true,
      },
    },
  },
};
