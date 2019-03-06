const UNLOGGER_LEVELS = require('./unlogger-levels');
const UnloggerProvider = require('./UnloggerProvider');

module.exports = class {
  /**
   *Creates an instance of Unlogger.
   * @param {UnloggerProvider[]?} [providers=[]] providers avaiable to log.
   * @param {*} [defaultContext=null] Default context to pass to log functions.
   * @param {string[]?} [levels=UNLOGGER_LEVELS] Levels that will be converted into log methods.
   * @memberof Unlogger
   */
  constructor(providers = [], defaultContext = null, levels = UNLOGGER_LEVELS) {
    this.providers = providers;
    this.defaultContext = defaultContext;
    this.levels = levels;
  }

  _unloggerProviderFactory(logFunctionOrUnloggerProvider, targetedLevels, evaluateFunction, formatterFunction, setupFunction) {
    let provider = logFunctionOrUnloggerProvider;
    if (typeof logFunctionOrUnloggerProvider === 'function') {
      provider = new UnloggerProvider(logFunctionOrUnloggerProvider, targetedLevels, evaluateFunction, formatterFunction);
    }
    if (setupFunction) {
      provider.setupFunction = setupFunction;
    }
    return provider;
  }

  _makeLogFunctions() {
    this.levels.forEach((level) => {
      this[level] = makeLogFunction(level, this.providers, this.defaultContext);
    });
  }

  /**
   * @description Add a provider to Unlogger object.
   * @param {Function|UnloggerProvider} logFunctionOrUnloggerProvider Function to call when targeted level is called OR an UnloggerProvider object.
   * @param {string[]?} targetedLevels Targeted levels which calls the log function.
   * @param {Function?} evaluateFunction Function to determine if log function will be called.
   * @param {Function?} formatterFunction Function that will transform log function arguments.
   * @returns
   * @memberof Unlogger
   */
  addProvider(logFunctionOrUnloggerProvider, targetedLevels, evaluateFunction, formatterFunction) {
    const provider = this._unloggerProviderFactory(
      logFunctionOrUnloggerProvider,
      targetedLevels,
      evaluateFunction,
      formatterFunction);
    return this.pushProvider(provider, provider.levels);
  }

  async addProviderAsync(logFunctionOrUnloggerProvider, setupArguments, setupFunction, targetedLevels, evaluateFunction, formatterFunction) {
    const provider = this._unloggerProviderFactory(
      logFunctionOrUnloggerProvider,
      targetedLevels,
      evaluateFunction,
      formatterFunction,
      setupFunction,
      setupArguments);
    await provider.setupFunction(provider, setupArguments);
    return pushProvider(provider, provider.levels);
  }

  pushProvider(provider, targetedLevels = []) {
    this.providers.push(provider);
    const allLevels = [...this.levels, ...targetedLevels ];
    this.levels = [...new Set(allLevels)];
    this._makeLogFunctions();
    return this;
  }

  /**
   * @description Sets the default context data for Unlogger and returns itself.
   * @param {*} context Default context data to pass to log functions.
   * @returns {Unlogger}
   * @memberof Unlogger
   */
  withContext(context) {
    this.defaultContext = context;
    this._makeLogFunctions();
    return this;
  }
}

/**
 * @description Make log function
 * @param {*} level Level to log
 * @param {*} providers providers to test
 * @returns Function
 */
function makeLogFunction(level, providers, defaultContext) {
  /**
   * @description Log something
   * @param {*} toLog Something to log
   * @param {*} context Context of something
   */
  function log(toLog, logContext) {
    let context;
    if (logContext && defaultContext) {
      const contextCopy = Object.assign({}, defaultContext);
      context = Object.assign(contextCopy, logContext);
    } else if (logContext) {
      context = logContext;
    } else if (defaultContext) {
      context = defaultContext;
    } 
    const triggeredProviders = providers
      .filter(provider => provider.levels.find(l => l === level));
    if (triggeredProviders.length) {
      triggeredProviders.forEach((provider) => {
        let shouldLog = true;
        if (provider.evaluateFunction) {
          shouldLog = provider.evaluateFunction(provider, level, toLog, context);
        }
        if (shouldLog) {
          const formatterFunction = provider.formatterFunction;
          const formattedLog = formatterFunction ? formatterFunction(provider, level, toLog, context) : toLog;
          provider.logFunction(provider, level, formattedLog, context);
        }
      });
    }
  }
  return log;
}
