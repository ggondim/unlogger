const UnloggerPlugin = require('../../src/UnloggerPlugin');

class EnvironmentPlugin extends UnloggerPlugin {
  constructor(defaultEnv = 'development') {
    super('env');
    this.levels = ['log', 'warn', 'error', 'info', 'debug', 'trace'];
    this.defaultEnv = defaultEnv;
  }

  format(logContext) {
    let env;
    if (process && process.env && process.env.NODE_ENV) {
      env = process.env.NODE_ENV;
    }
    if (!env) env = this.defaultEnv;
    logContext.env = env;
    return '';
  }
}

module.exports = EnvironmentPlugin;
