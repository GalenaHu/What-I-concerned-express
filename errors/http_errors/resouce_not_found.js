const HttpBaseError = require('./http_base_error');

const ERROR_CODE = 4040000;

class ResouceNotFoundError extends HttpBaseError {
  constructor(resouceName, resouceId, httpMsg) {
    super(200, httpMsg, ERROR_CODE, `${resouceName} not found, id: ${resouceId}`);
  }
}

module.exports = ResouceNotFoundError;
