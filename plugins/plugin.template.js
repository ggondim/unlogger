const { UnloggerPlugin } = require('unlogger');

class TemplatePlugin extends UnloggerPlugin {
  constructor() {
    const levels = ['log', 'warn', 'error', 'info', 'debug', 'trace'];
    super('template');
    super.initializeLevels(levels, this);
  }

  evaluate({ level, formatted, toLog, plugins, outputs }) {
    return true;
  }

  format({ level, toLog, plugins, outputs }) {
    return '';
  }

  log({ level, formatted, toLog, plugins, outputs }) {
  }
}

module.exports = TemplatePlugin;
