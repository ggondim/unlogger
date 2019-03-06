# unlogger-env-console
A console provider for [Unlogger](https://github.com/NOALVO/unlogger) which conditionally logs based on NODE_ENV variable.

## Levels
`log`, `trace`, `debug`, `info`, `warn`, `error`

## Basic usage
```
$ npm i -s @unlogger/core @unlogger/env-console 
```
The following code will log only if `NODE_ENV` environment variable is not `'production'`.
```javascript
const { logger } = require('@unlogger/core');
const envConsoleProvider = require('@unlogger/env-console');

logger.addProvider(envConsoleProvider);

logger.log('log test');
logger.trace('trace test');
logger.debug('debug test');
logger.info('info test');
logger.warn('warn test');
logger.error('error test');
```

## Manually changing environment

If you can't control `NODE_ENV` environment variable, you set an `env` property to a [global context](https://github.com/NOALVO/unlogger#global-context) in unlogger.

```javascript
logger
  .withContext({ env: 'production' })
  .addProvider(envConsoleProvider);
```
