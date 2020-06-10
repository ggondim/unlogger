const { UnloggerPlugin } = require('unlogger');

class TimestampPlugin extends UnloggerPlugin {
  constructor() {
    super('timestamp');
  }

  format() {
    return `[${(new Date()).toISOString()}]`;
  }
}

module.exports = TimestampPlugin;
