const logger = require('../utils/loggers/logger');

module.exports = (req, res) => {
  if (res.headersSent) {
    logger.error('error sending response: header already sent', { url: req.originalUrl });
  } else {
    res.json({ code: 200, data: res.data });
  }
};
