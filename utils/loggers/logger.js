const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const loggerSetting = require('../../setting').logger;

const { Console } = transports;
const { combine, timestamp, json } = format;

const logger = createLogger({
  format: combine(
    timestamp(),
    json(),
  ),
  transports: [
    new Console(),
    new DailyRotateFile({
      filename: `${loggerSetting.path}/info.%DATE%.log`, level: 'info', datePattern: 'YYYY-MM-DD', label: 'base_logger',
    }),
    new DailyRotateFile({
      filename: `${loggerSetting.path}/error.%DATE%.log`, level: 'error', datePattern: 'YYYY-MM-DD', label: 'base_logger',
    }),
  ],
});

module.exports = logger;
