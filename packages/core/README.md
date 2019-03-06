# `@unlogger/core`

Unopinionated & provider-oriented logger, with conditional logging, custom formatting and targeted levels control.

## 🤚 This is the default docs for `core` package

You can find here documentation for custom provider creation and interoperability.

If you want to see the basic README, which explains basic usage, features and avaiable providers, see [Unlogger's README](https://github.com/NOALVO/unlogger).

## Table of contents

In this file:
  - [Basic usage](#Basic-usage)
  - [Advanced usage](#Advanced-usage)
  - [Choosing levels](#Choosing-levels)
  - [Conditional logging](#Conditional-logging)
  - [Custom formatting](#Custom-formatting)
  - [Custom async providers](#Custom-async-providers)

See also:
- [Customizing levels](https://github.com/NOALVO/unlogger/tree/master/packages/core/docs/customizing-levels.md)
- [Context and Global Context](https://github.com/NOALVO/unlogger/tree/master/packages/core/docs/context-and-global-context.md)
- [`UnloggerProvider` class](https://github.com/NOALVO/unlogger/tree/master/packages/core/docs/unlogger-provider-class.md)

## Creating custom providers

### Basic usage
The simplest creation of a custom provider is using the `addProvider` method and passing a logging callback as the first argument.

```javascript
logger.addProvider((provider, level, toLog, context) => {
  console.warn('THIS IS A WARNING:' + toLog);
});
```

#### Arguments
The log function recieves three arguments:

**`provider`** _[UnloggerProvider](https://github.com/NOALVO/unlogger/tree/master/packages/core/docs/unlogger-provider-class.md)_   
The own instance of provider. Useful to access internal properties or methods.

**`level`** _string_   
The level triggered by the log method called. E.g.: `logger.warn()` will trigger the level `'warn'`.

**`toLog`** _any_   
Anything to log. This may be a string, an object or any value to use for logging.

**`context`** _object?_ (optional)  
An optional object to use as complementary information for the log function, such as environment variables, user info, etc. You can specify a global context to use for all providers. See [Context and Global Context](https://github.com/NOALVO/unlogger/tree/master/packages/core/docs/context-and-global-context.md) for more details.

### Advanced usage
The `addProvider` method receives one or four arguments.

```javascript
logger.addProvider(logFunctionOrUnloggerProvider, levels, evaluateFunction, formatterFunction);
```

When using the one argument way, you need to pass an [`UnloggerProvider`](https://github.com/NOALVO/unlogger/tree/master/packages/core/docs/unlogger-provider-class.md) object.

When using the four arguments way, you need to pass the following arguments:

**`logFunction`** _Function_    
The log function which will be called. See [log functions arguments](#Arguments).

**`levels`** _string[]?_ (optional)    
An array of levels that will trigger and call the log function. See [Customizing levels](https://github.com/NOALVO/unlogger/tree/master/packages/core/docs/customizing-levels.md) for more details.

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
When adding an async provider to unlogger, you can use it just like described at the [Async providers](https://github.com/NOALVO/unlogger#Async-providers) section.

#### UnloggerProvider class way
👋 It's much better to use custom async providers with the [UnloggerProvider class](https://github.com/NOALVO/unlogger/tree/master/packages/core/docs/unlogger-provider-class.md). To use this way, you will need to set a property `setupFunction` in the provider instance and pass a `setupArguments` parameter to the `addProviderAsync` method.

Example:
```javascript
const { logger, UnloggerProvider } = require('@unlogger/core');

const customAsyncProvider = new UnloggerProvider(logFunction);
customAsyncProvider.setupFunction = setupFunction;

await logger
  .addProviderAsync(customAsyncProvider, { initialize: 'data' });
```

To see a more pratical example, take a look at the [@unlogger/bugsnag](https://github.com/NOALVO/unlogger-bugsnag) provider.
