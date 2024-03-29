module.exports = {
  env: {
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
  },
  plugins: ['prettier'],
  settings: {
    'import/resolver': {
      'babel-module': {},
    },
  },
};
