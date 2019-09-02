const HttpBaseError = require('./http_base_error');

const ERROR_CODE = 3000000;
class NoSuchUserError extends HttpBaseError {
  constructor(username, id) {
    super(200, '该用户不存在', ERROR_CODE, `no such user, ${username}, ${id}`);
  }
}
module.exports = NoSuchUserError;
