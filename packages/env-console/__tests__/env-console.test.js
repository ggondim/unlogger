let { logger } = require('@unlogger/core');
const envConsoleProvider = require('../lib/index');

describe('@unlogger/env-console', () => {
    before(() => {
        logger.addProvider(envConsoleProvider);
    });
    it('should log all levels by default', (done) => {
        logger.log('log test');
        logger.trace('trace test');
        logger.debug('debug test');
        logger.info('info test');
        logger.warn('warn test');
        logger.error('error test');
        done();
    });
    it('should NOT log in any level when ENV manually set to production', (done) => {
        logger.withContext({ env: 'production' });
        logger.log('log test');
        logger.trace('trace test');
        logger.debug('debug test');
        logger.info('info test');
        logger.warn('warn test');
        logger.error('error test');
        done();
    });
});
