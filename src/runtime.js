'use strict';

// GIT_COMMIT and BUILD_ID are baked into the image at build time: they are
// immutable facts about the build. Everything else is supplied by the
// environment at deploy time, so the same image can run in STAGING and PROD.
// APP_ENVIRONMENT and APP_RELEASE_VERSION are set by the GxP framework.
function readRuntimeInfo(env = process.env) {
  return {
    application: 'gxp-demo-app',
    displayName: env.APP_DISPLAY_NAME || 'GxP Demo App',
    environment: env.APP_ENVIRONMENT || 'local',
    release: env.APP_RELEASE_VERSION || 'unreleased',
    commit: env.GIT_COMMIT || 'unknown',
    build: env.BUILD_ID || 'local',
    showEnvironmentBanner: env.APP_SHOW_ENV_BANNER === 'true',
  };
}

module.exports = { readRuntimeInfo };
