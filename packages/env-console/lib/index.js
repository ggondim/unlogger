const { UnloggerProvider } = require('@unlogger/core');

const consoleLevels = [ 'log', 'info', 'debug', 'trace', 'warn', 'error' ];
const envConsoleProvider = new UnloggerProvider(logFunction, consoleLevels, evaluateFunction);
module.exports = envConsoleProvider;

function logFunction(provider, level, toLog, context) {
  console[level](toLog);
}

function evaluateFunction(provider, level, toLog, context) {
  let env;
  if (context) {
    env = context.env;
  } else if (!env && process && process.env) {
    env = process.env.NODE_ENV;
  }
  return env !== 'production';
}
