class UnloggerPlugin {
  constructor(pluginName) {
    this.name = pluginName;
    this.levels = [];
  }

  initializeLevels(levels, self) {
    this.levels = levels;
    levels.forEach((level) => {
      self[level] = self.log.bind(self);
    });
  }
}

module.exports = UnloggerPlugin;
