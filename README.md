# unlogger
Unopinionated & provider-oriented logger, with conditional logging, custom formatting and targeted levels control.

The main purpose of unlogger is the ability to create providers that behave as different logging targets. That means you can build your logger to log into a file, or to console, or a database, etc.

## Features

- Provider-oriented logger, with official, community and your own custom providers
- Conditional logging
- Custom log formatting
- Configurable levels to target per log provider

## Usage
1: Install the [core package](https://www.npmjs.com/package/@unlogger/core) using npm in your project:
```
$ npm i -s @unlogger/core
```
2: Install and require the desired providers, choosing one of the following options:
- [Officially distributed providers](#Officially-distributed-providers) by Unlogger's creators
- [Community-built providers](#Community-built-providers)
- Create your own [custom provider](https://github.com/NOALVO/unlogger/tree/master/packages/core#Custom-providers)
```
$ npm i -s @unlogger/theprovidernameyouwanthere
```
```javascript
const { logger } = require('@unlogger/core');
const provider = require('@unlogger/theprovidernameyouwanthere');
logger.addProvider(provider);
```
3: Use the logger normally as any other logger:
```javascript
logger.log('A message');
logger.warn({ an: 'object' });
logger.error({ an: 'object' }, { a: 'context required by your provider' });
```

#### Default levels
Unlogger defaults to three logging levels (`log`, `warn` and `error`), but it depends on the providers you are using. Some providers can extend the logging levels, like the [@unlogger/env-console](https://github.com/NOALVO/unlogger/tree/master/packages/env-console) provider.

If you want to customize these levels, see [Customizing levels](https://github.com/NOALVO/unlogger/tree/master/packages/core/docs/customizing-levels.md).

#### Async providers
Some providers will require setup functions and need to be added in an async way. To use them you will need to call the method `addProviderAsync` instead `addProvider` and pass the required data to setup as the second argument.

```javascript
await logger.addProviderAsync(asyncProvider, { required: 'options here' });
```

## Avaiable providers

### Officially distributed providers
We built some providers ourselves but you can find other community providers at the `@unlogger` scope in npm.
- [@unlogger/env-console](https://github.com/NOALVO/unlogger/tree/master/packages/env-console): a provider to log using `console` conditionally to `NODE_ENV`. 
- [@unlogger/bugsnag](https://github.com/NOALVO/unlogger-bugsnag): a provider that uses [Bugsnag](https://www.bugsnag.com/) as logger. 

### Community-built providers
⚠ **We need contributors!** Make a provider, fork this repo and make a pull request to include your provider in this section.

### Custom providers
Create your own customized provider by following the [Custom provider docs](https://github.com/NOALVO/unlogger/tree/master/packages/core#Creating-custom-providers)

## Spread the word!
Donate a post in Facebook, Twitter or your favourite social network.

## License
MIT

## Curiosity
`unlogger` name comes from the acronym of the words "**un**opinionated" and "**logger**" 😀
