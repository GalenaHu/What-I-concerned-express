const HttpBaseError = require('./http_base_error');

const ERROR_CODE = 5000000;

class InternalServerError extends HttpBaseError {
  constructor(msg) {
    super(200, '服务器错误，请稍后刷新', ERROR_CODE, `something got wrong: ${msg}`);
  }
}
module.exports = InternalServerError;
