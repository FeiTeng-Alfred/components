const {defaults} = require('jest-config');

module.exports = {
  // ...
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  setupFilesAfterEnv: ['src/jest-setup.js']

  // ...
};