const logger = require('../utils/loggers/logger');

function ErrorHandler() {
  return function (err) {
    logger.error(`uncaught error in the middleware process ${err.message}`);
  };
}

module.exports = ErrorHandler;
