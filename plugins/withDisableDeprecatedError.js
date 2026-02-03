const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Config plugin that adds -Wno-error=deprecated-declarations to the
 * Android CMake C++ build flags. This suppresses the build error from
 * react-native-screens using the deprecated ShadowNode::Shared type
 * with react-native 0.81.5.
 */
module.exports = function withDisableDeprecatedError(config) {
  return withAppBuildGradle(config, (config) => {
    let contents = config.modResults.contents;

    if (contents.includes('Wno-error=deprecated-declarations')) {
      return config;
    }

    // Find 'defaultConfig {' and inject cmake cppFlags right after it
    const match = contents.match(/defaultConfig\s*\{/);
    if (match) {
      const idx = contents.indexOf(match[0]) + match[0].length;
      const injection = `
        // [VaNi] Suppress deprecated-declarations error from react-native-screens
        externalNativeBuild {
            cmake {
                cppFlags "-Wno-error=deprecated-declarations"
            }
        }`;
      config.modResults.contents =
        contents.slice(0, idx) + injection + contents.slice(idx);
    }

    return config;
  });
};
