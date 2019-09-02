const JWT = require('jsonwebtoken');
const User = require('../models/mongoose/user');
const Subscription = require('../models/mongoose/subscription');
const ResouceNotFoundError = require('../errors/http_errors/resouce_not_found');
const HttpRequestParamError = require('../errors/http_errors/http_request_param_error');
const NoSuchUserError = require('../errors/http_errors/no_such_user_error');
const JWTConfig = require('../cipher/jwt_config');

module.exports.getAllUsers = async function () {
  const users = await User.list();
  return users;
};

module.exports.addNewUser = async function (user) {
  if (!user || !user.username || !user.password || !user.name) {
    throw new HttpRequestParamError('user', '用户名或密码不能为空', 'username or password cannot be empty');
  }
  const created = await User.createUserByNamePass(user);
  const token = JWT.sign({
    // eslint-disable-next-line no-underscore-dangle
    _id: created._id.toString(),
    expireAt: Date.now().valueOf() + JWTConfig.expiresIn,
  }, JWTConfig.SECRET);
  return {
    user: created,
    token,
  };
};

module.exports.loginWithNamePass = (username, password) => {
  if (!username || !password) {
    throw new HttpRequestParamError('user', '用户名或密码不能为空', 'username or password cannot be empty');
  }
  const found = User.getUserByNamePass(username, password);
  if (!found) { throw new NoSuchUserError(username, null); }
  const token = JWT.sign({
    // eslint-disable-next-line no-underscore-dangle
    _id: found._id.toString(),
    expireAt: Date.now().valueOf() + JWTConfig.expiresIn,
  }, JWTConfig.SECRET);
  return {
    token,
    user: found,
  };
};


module.exports.getUserById = async function (userId) {
  const user = await User.getOneById(userId);
  if (user) {
    return user;
  }
  return new ResouceNotFoundError('user', '无此用户', `id: ${userId}`);
};

module.exports.getUserByName = async function (name) {
  const user = await User.getOneByName(name);
  return user;
};

module.exports.createSubscription = async function (userId, url) {
  const user = await User.getOneById(userId);
  if (!user) { throw new NoSuchUserError(null, userId); }
  const sub = Subscription.insert({ userId, url });
  return sub;
};
