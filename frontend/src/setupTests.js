// src/setupTests.js
const { TextEncoder, TextDecoder } = require('util');

Object.assign(global, { TextEncoder, TextDecoder });
// Add jest-dom matchers for better DOM assertions (toHaveTextContent, etc.)
require('@testing-library/jest-dom');