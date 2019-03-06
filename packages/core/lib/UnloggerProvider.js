module.exports = class UnloggerProvider {
  /**
   *Creates an instance of UnloggerProvider.
   * @param {Function} logFunction Function to call when targeted level is called.
   * @param {string[]} levels Targeted levels which calls the log function.
   * @param {Function?} evaluateFunction Function to determine if log function will be called.
   * @param {Function?} formatterFunction Function that will transform log function arguments.
   * @memberof UnloggerProvider
   */
  constructor(logFunction, levels, evaluateFunction, formatterFunction) {
    this.logFunction = logFunction;
    this.levels = levels;
    this.evaluateFunction = evaluateFunction;
    this.formatterFunction = formatterFunction;
  }
}
