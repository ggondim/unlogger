# unlogger
Unopinionated & provider-oriented logger, with conditional logging, custom formatting and targeted levels control.

## Features
- Custom log providers
- Configurable levels to target per log provider
- Conditional logging
- Custom log formatting
- Community ready-for-use providers

## How to use
Install the [core package](https://www.npmjs.com/package/@unlogger/core) using npm in your project:
```
$ npm i -s @unlogger/core
```
Install and require the desired providers. See [avaiable officially distributed providers by Unlogger's creators](#Officially-distributed-providers) or create your own [custom provider](#Custom-providers).
```
$ npm i -s @unlogger/theprovidernameyouwanthere
```
```javascript
const { logger } = require('@unlogger/core');
const provider = require('@unlogger/theprovidernameyouwanthere');
logger.addProvider(provider);
```
Use the logger normally as any other logger:
```javascript
logger.log('Something');
logger.warn({ an: 'object' });
logger.error({ an: 'object' }, { and: 'a context' });
```

#### Default levels
Unlogger supports three default levels to use as log methods: `log`, `warn` and `error`. If you want to customize these levels, see [Customizing unlogger default levels](#Customizing-unlogger-default-levels).

## Officially distributed providers
We built some providers ourselves but you can find other community providers at the `@unlogger` scope in npm.
- [@unlogger/env-console](https://github.com/NOALVO/unlogger/packages/env-console/README.md): a provider to log using `console` conditionally to `NODE_ENV`. 
- [@unlogger/bugsnag](https://github.com/NOALVO/unlogger-bugsnag): a provider that uses [Bugsnag](https://www.bugsnag.com/) as logger. 

### Community-built providers
⚠ **We need contributors!** Make a provider, fork this repo and make a pull request to include your provider in this section.

## Async providers

Some providers require setup functions and need to be added in an async way. To use them you will need to call the method `addProviderAsync` instead `addProvider` and pass the required data to setup as the second argument.

```javascript
const { logger } = require('@unlogger/core');
const asyncProvider = require('@unlogger/theasyncprovidername');

await logger.addProviderAsync(asyncProvider, { required: 'options here' });
```

## Custom providers
The main purpose of unlogger is the ability to create custom providers that behave as different logging targets. That means you can build your logger to log into a file, or to console, or a database, etc.

### Basic usage
The simplest creation of a custom provider is using the `addProvider` method and passing a logging callback as the first argument.

```javascript
logger.addProvider((provider, level, toLog, context) => {
  console.warn('THIS IS A WARNING:' + toLog);
});
```

#### Arguments
The log function recieves three arguments:

**`provider`** _[UnloggerProvider](#UnloggerProvider-class)_   
The own instance of provider. Useful to access internal properties or methods.

**`level`** _string_   
The level triggered by the log method called. E.g.: `logger.warn()` will trigger the level `'warn'`.

**`toLog`** _any_   
Anything to log. This may be a string, an object or any value to use for logging.

**`context`** _object?_ (optional)  
An optional object to use as complementary information for the log function, such as environment variables, user info, etc. You can specify a global context to use for all providers. See [Global Context](#Global-context).

### Advanced usage
The `addProvider` method receives one or four arguments.

```javascript
logger.addProvider(logFunctionOrUnloggerProvider, levels, evaluateFunction, formatterFunction);
```

When using the one argument way, you need to pass an [`UnloggerProvider`](#UnloggerProvider-class) object.

When using the fourg arguments way, you need to pass the following arguments:

**`logFunction`** _Function_    
The log function which will be called. See [log functions arguments](#Arguments).

**`levels`** _string[]?_ (optional)    
An array of levels that will trigger and call the log function. See [Choosing levels](#Choosing-levels) for more details.

**`evaluateFunction`** _Function?_ (optional)    
A function to be used as a filter to determines if the log function will be called or not. See [Conditional logging](#Conditional-logging) for more details.

**`formattingFunction`** _Function?_ (optional)    
A function that takes the original `toLog` argument and transform it before pass to the log function. See [Custom formatting](#Custom-formatting) for more details. 

### Choosing levels
The `levels` argument determines what methods will trigger the log function. So, if you specify `['warn', 'trace']` as levels, only `logger.warn()` and `logger.trace()` will call the log function.

If you don't specify the `levels` argument, all the ***default levels will be used and will fire the log function. 

### Conditional logging
The `evaluateFunction` argument expects a function with the same [arguments](#Arguments) of `logFunction` and **must always return a _boolean_**.

You can use it to determines if the log function should be called or not. For example, if you want to make a environment-based log:

```javascript
function evaluateFn(provider, level, toLog, context) {
  const environment = context.env || process.env.NODE_ENV;
  return environment !== 'production';
}
```

### Custom formatting
The `formattingFunction` argument expects a function with the same [arguments](#Arguments) of `logFunction` and **may return any value to log**.

This is useful to transform log messages, append prefixes, etc. Example:

```javascript
function formattingFn(provider, level, toLog, context) {
  const sum = toLog.a + context.port;
  const timestamp = new Date();
  return `[${timestamp}] port is ${sum}`;
}
```

### `UnloggerProvider` class

The `UnloggerProvider` class takes a constructor with the same parameters as [`addProvider` function](#Advanced-usage) and set four properties with the same arguments' name.

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

### Custom async providers
If you need to make a provider that requires some initialization log to run, such as database connection, etc., you will need to use the `addProviderAsync` method instead `addProvider`. The main difference is that you can await for the returning promise and the function signature:

```javascript
addProviderAsync(logFunctionOrUnloggerProvider, setupArguments, setupFunction, targetedLevels, evaluateFunction, formatterFunction)
```

You already have noticed that the signature of `addProviderAsync` have two more parameters than `addProvider`, which are:

**`setupArguments`** _any_   
Any data needed to pass to setup function.

**`setupFunction`** _async Function_   
The async function that will run just after adding the provider.

#### Usage
When adding an async provider to unlogger, you can use it just like described at the [Async providers](#Async-providers) section.

#### UnloggerProvider class way
👋 It's much better to use custom async providers with the [UnloggerProvider class](#UnloggerProvider-class). To use this way, you will need to set a property `setupFunction` in the provider instance and pass a `setupArguments` parameter to the `addProviderAsync` method.

Example:
```javascript
const { logger, UnloggerProvider } = require('@unlogger/core');

const customAsyncProvider = new UnloggerProvider(logFunction);
customAsyncProvider.setupFunction = setupFunction;

await logger
  .addProviderAsync(customAsyncProvider, { initialize: 'data' });
```

To see a more pratical example, take a look at the [@unlogger/bugsnag](https://github.com/NOALVO/unlogger-bugsnag) provider.

## Global context
You can set a default context to unlogger by using the `withContext` method and passing any object as an argument.

Example:
```javascript
const { logger } = require('@unlogger/core');
logger.withContext({
  env: process.env.NODE_ENV
});
```

That way, all the log functions called by unlogger will use the default context.

### Context override
If you both set a global context and specify a [context argument](#Arguments) when calling a log method, the two objects will be merged, giving preference to the context argument.

This means the **global context properties will be overriden if the same properties are present in the context argument**. 

## Extending a provider
TO-DO

## Customizing unlogger default levels
❗ **You don't need to add any level to unlogger.** Unlogger takes non-existent levels detected during `addProvider` method and adds as methods into its own instance.

### Removing levels
If you need to remove a level/method, you have two ways:

#### 1. Reassinging  `levels` array and deleting the corresponding method

```javascript
const level = 'warn';
logger.levels = logger.levels.filter(x => x !== level);
delete logger[level];
```

#### 2. Recreating the unlogger object, passing the default  levels without the desired level

```javascript
const levels = ['log', 'error'];
const newLogger = oldLogger._factory(levels);
```

This will reset already added providers and the default context (if it was set). In this case, you will need to reset these properties:

```javascript
newLogger.providers = oldLogger.providers;
newLogger.defaultContext = oldLogger.defaultContext; 
```

## Spread the word!
Donate a post in Facebook, Twitter or your favourite social network.

## License
MIT

## Curiosity
`unlogger` name comes from the acronym of the words "**un**opinionated" and "**logger**" 😀
