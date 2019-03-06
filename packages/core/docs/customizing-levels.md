# Customizing levels
A "level" is a log method distinguished by its severity name, such as "info", "warn", "error", "f%ck", etc.

Semantically, you should use them to differentiate your logging and aplly them to different targets, such as a database for "errors" and just console for "infos".

## Adding levels

❗ **You don't need to add any level to unlogger.** Unlogger takes non-existent levels detected during `addProvider` method and adds as methods into its own instance.

See [Choosing levels](https://github.com/NOALVO/unlogger/tree/master/packages/core#Choosing-levels) when creating your provider.

## Removing levels
It is not recommended to remove a level, as they are added by the providers.

But, if you REALLY need to remove a level/method, you need to:
1. Delete it from `levels` array
2. Delete the corresponding method from logger

```javascript
const level = 'warn';
logger.levels = logger.levels.filter(x => x !== level);
delete logger[level];
```
