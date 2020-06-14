const UnloggerPlugin = require('../../src/UnloggerPlugin');

class TimestampPlugin extends UnloggerPlugin {
  constructor() {
    super('timestamp');
    this.levels = ['log', 'warn', 'error', 'info', 'debug', 'trace'];
  }

  format() {
    return `[${(new Date()).toISOString()}]`;
  }
}

module.exports = TimestampPlugin;
