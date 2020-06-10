const { UnloggerPlugin } = require('unlogger');
const Bugsnag = require('@bugsnag/js');

class BugsnagPlugin extends UnloggerPlugin {
  constructor(apiKey, options = {}) {
    const levels = ['log', 'warn', 'error', 'info', 'debug', 'trace'];
    super('template');
    super.initializeLevels(levels, this);

    this.apiKey = apiKey;
    const bugsnagOptions = { apiKey, ...options };
    this.options = bugsnagOptions;
    this.bugsnag = Bugsnag;
  }

  log(logContext) {
    const { level, toLog } = logContext;

    let errorName;
    if (toLog instanceof Error) {
      errorName = toLog.toString();
    } else if (typeof toLog === 'string') {
      errorName = toLog;
    } else if (toLog.message) {
      errorName = toLog.message;
    } else {
      errorName = JSON.stringify(toLog);
    }

    Bugsnag.notify(new Error(errorName), (event) => {
      event.app.releaseStage = logContext.env;
      event.severity = level;
      event.addMetadata('log', toLog);
    });
  }
}

module.exports = BugsnagPlugin;
