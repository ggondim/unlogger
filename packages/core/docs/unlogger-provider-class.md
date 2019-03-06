# `UnloggerProvider` class

The `UnloggerProvider` class takes a constructor with the same parameters as [`addProvider` function](https://github.com/NOALVO/unlogger/tree/master/packages/core#Advanced-usage) and set four properties with the same arguments' name.

```javascript
class UnloggerProvider {
  constructor(logFunction, levels, evaluateFunction, formatterFunction) {
    this.logFunction = logFunction;
    this.levels = levels;
    this.evaluateFunction = evaluateFunction;
    this.formatterFunction = formatterFunction;
  }
}
```

This is useful to extend already built providers and make add some extra functionality to them.

You can use the class by using the `UnloggerProvider` property avaiable in unlogger module. Example:

```javascript
const { UnloggerProvider } = require('@unlogger/core');

const provider = new UnloggerProvider(..args);
```
