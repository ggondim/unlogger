class UnloggerPlugin {
  constructor({ pluginName, levels, logFunction }) {
    this.name = pluginName;
    this.format = (logContext) => {};
    this.evaluate = (logContext) => {};
    this.levels = [];
  }

  initializeLevels(levels, self) {
    levels.forEach((level) => {
      self[level] = self.log.bind(self);
    });
  }
}

module.exports = UnloggerPlugin;
