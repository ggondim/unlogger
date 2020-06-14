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
    Bugsnag.start(bugsnagOptions);
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

    if (errorName.startsWith('Error')) {
      errorName = errorName.replace('Error:', '').trim();
    }

    Bugsnag.notify(new Error(errorName), (event) => {
      event.app.releaseStage = logContext.env;

      let severity;
      if (level === 'error') severity = 'error';
      else if (level === 'warn' || level === 'warning') severity = 'warning';
      else if (level === 'log' || level === 'info') severity = 'info';
      else severity = 'error';
      event.severity = severity;

      event.addMetadata('log', toLog);
    });
  }
}

module.exports = BugsnagPlugin;
