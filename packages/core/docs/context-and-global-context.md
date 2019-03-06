# Context
"Context" means an additional object you want to pass to log functions. 

Some providers use this object to evaluate expressions and determine if them should log, or to format the log argument, or to make something brilliant.

### Global context

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
