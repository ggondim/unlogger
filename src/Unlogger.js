const UnloggerPlugin = require('./UnloggerPlugin');

const ConsolePlugin = require('../plugins/console/index');
const TimestampPlugin = require('../plugins/timestamp/index');
const EnvironmentPlugin = require('../plugins/env/index');

class Unlogger {
  constructor() {
    this.plugins = [
      new EnvironmentPlugin(),
      new TimestampPlugin(),
      new ConsolePlugin(),
    ];
    this.UnloggerPlugin = UnloggerPlugin;
  }

  static get UnloggerPlugin() {
    return UnloggerPlugin;
  }

  logLevel(level, toLog) {
    const logContext = {
      level,
      toLog,
      plugins: this.plugins,
      formatted: '',
      outputs: {},
    };

    this.plugins.forEach((plugin) => {
      if (plugin.levels.includes(level) && plugin.format) {
        logContext.formatted += ` ${plugin.format(logContext)}`;
      }
    });

    this.plugins.forEach((plugin) => {
      if (plugin.levels.includes(level)) {
        let shouldLog = true;
        if (plugin.evaluate) {
          shouldLog = plugin.evaluate(logContext);
        }

        if (shouldLog && plugin[level]) {
          const output = plugin[level].call(plugin, logContext);
          logContext.outputs[plugin] = output;
        }
      }
    });
  }

  use(plugin) {
    this.plugins.push(plugin);

    const unlogger = this;
    plugin.levels.forEach((level) => {
      if (!unlogger[level]) {
        unlogger[level] = unlogger.logLevel.bind(unlogger, level);
      }
    });

    return unlogger;
  }

  log(toLog) { return this.logLevel('log', toLog); }

  info(toLog) { return this.logLevel('info', toLog); }

  warn(toLog) { return this.logLevel('warn', toLog); }

  error(toLog) { return this.logLevel('error', toLog); }

  trace(toLog) { return this.logLevel('trace', toLog); }

  debug(toLog) { return this.logLevel('debug', toLog); }
}

module.exports = Unlogger;
