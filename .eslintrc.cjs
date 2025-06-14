module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
  },
  extends: ['@weni/eslint-config/vue3'],
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-components': 'off',
    'vue/no-mutating-props': 'off',
    'vue/valid-next-tick': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'vue/valid-attribute-name': 'off',
  },
  parserOptions: {
    ecmaVersion: 'latest',
    ecmaFeatures: {
      importAssertions: true,
    },
  },
};
