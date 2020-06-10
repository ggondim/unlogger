const UnloggerPlugin = require('../../src/UnloggerPlugin');

class ConsolePlugin extends UnloggerPlugin {
  constructor(cons = console) {
    const levels = ['log', 'warn', 'error', 'info'];
    super('console');
    super.initializeLevels(levels, this);
    this.console = cons;
  }

  evaluate(logContext) {
    if (logContext.env) {
      return logContext.env.toLowerCase() !== 'production';
    }
    return !!this.console;
  }

  format({ level, toLog, plugins, outputs }) {
    let formatted;
    if (typeof toLog === 'object' && toLog instanceof Error) {
      const newObject = {
        message: toLog.toString(),
        error: JSON.stringify(toLog),
      };
      formatted = JSON.stringify(newObject);
    } else if (typeof toLog === 'object') {
      formatted = JSON.stringify(toLog);
    } else {
      formatted = toLog;
    }
    return formatted;
  }

  log({ level, formatted, toLog, plugins, outputs }) {
    let logger;
    switch (level) {
      case 'warn':
        logger = this.console.warn;
        break;
      case 'error':
        logger = this.console.error;
        break;
      case 'info':
        logger = this.console.info;
        break;
      default:
        logger = this.console.log;
        break;
    }
    logger(formatted);
  }
}

module.exports = ConsolePlugin;
