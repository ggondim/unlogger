const unlogger = require('../src/index');

unlogger.log({ test: 'yay '});

unlogger.warn('watch out');

const error = new Error('error message 404');
error.data = { it: 'is' };
unlogger.error(error);
