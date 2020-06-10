const unlogger = require('unlogger');
const BusnagPlugin = require('../index');

unlogger.use(new BusnagPlugin('a81b0189c2cb610217b9425a2b4b5072'));

unlogger.log({ test: 'yay '});

unlogger.warn('watch out');

const error = new Error('error message 404');
error.data = { it: 'is' };
unlogger.error(error);
