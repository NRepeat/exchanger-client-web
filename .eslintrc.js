module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/recommended",
    "plugin:prettier/recommended"
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    "eqeqeq": ["error", "always"],
    "max-len": ["error", { "code": 120 }],
    "indent": ['error', 2],
    "semi": [2, "always"],
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-alert": "error",
    "vue/max-attributes-per-line": "off",
    "vue/no-v-html": "off",
    "prettier/prettier": [2, {
      "semi": true,
      "printWidth": 120,
      "bracketSpacing": false
    }],
    "vue/html-self-closing": ["error", {
      "html": {
        "void": "any",
        "normal": "always",
        "component": "always"
      },
      "svg": "always",
      "math": "always"
    }],

    // "vue/script-indent": [2, 2, {"baseIndent": 0,"switchCase": 1}],
    "vue/html-indent": [2, 2],

  }
};
