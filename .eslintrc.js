module.exports = {
  env: {
    browser: true,
    node: true,
    es2024: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  globals: {
    API: 'readonly',
    Utils: 'readonly',
    L: 'readonly',
    QRCode: 'readonly',
    Alpine: 'readonly',
    approveCertification: 'writable',
    rejectCertification: 'writable',
    closeModal: 'writable'
  },
  rules: {
    'no-console': 'off',
    'no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }]
  }
};
