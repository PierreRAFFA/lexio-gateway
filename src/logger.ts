import * as winston from 'winston';

const levels = [
  'error',
  'warn',
  'info',
  'verbose',
  'debug',
  'silly'
];

const logger = new winston.Logger({
    level: levels[process.env.LOG_LEVEL || 'silly'],
    transports:
      [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new (winston.transports.Console)({
          timestamp: function () {
            // The timezone is always zero UTC offset, as denoted by the suffix "Z"
            return `[${new Date().toISOString()}]`;
          },
          formatter: function (options) {
            // - Return string will be passed to logger.
            // - Optionally, use options.colorize(options.level, <string>) to
            //   colorize output based on the log level.
            return options.timestamp() + ' ' +
              winston.config.colorize(options.level, options.level.toUpperCase()) + ' ' +
              (options.message ? options.message : '') +
              (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
          }
        })
      ]
  })
;

export default logger;
