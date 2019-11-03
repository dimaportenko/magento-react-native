module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: [
    'react'
  ],
  rules: {
    'object-curly-spacing': [
      "error", "always", { "objectsInObjects": true }
    ],
    'prettier/prettier': 0,
    "react/prop-types": 1
  }
};
