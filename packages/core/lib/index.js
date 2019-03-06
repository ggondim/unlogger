const Unlogger = require('./Unlogger');
const UnloggerProvider = require('./UnloggerProvider');

module.exports = {
  logger: new Unlogger(),
  Unlogger,
  UnloggerProvider,
}
