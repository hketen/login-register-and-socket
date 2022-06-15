module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: [
    'eslint-plugin-import',
    'eslint-plugin-node',
    'eslint-plugin-promise',
  ],
  root: true,
  globals: {
    env: 'readonly',
    defaultLanguage: 'readonly',
    microServiceName: 'readonly',
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-var': [2],
    eqeqeq: ['error', 'always'],
    'no-case-declarations': 'off',
    'no-async-promise-executor': 'off',
  },
};
