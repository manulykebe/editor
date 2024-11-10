    console.log('test');
    const { Logger, Group, sleep } = require('async-monitor.js');
    const demo01 = new Group({repeat: 3});

    const logger = demo01.logger;
    logger.useLogger = true;
    console.log(logger);