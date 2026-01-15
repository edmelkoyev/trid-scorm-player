import { createDefaultPreset } from 'ts-jest'

const presetConfig = createDefaultPreset();

module.exports = {
  ...presetConfig,
  testEnvironment: 'jsdom',
};
