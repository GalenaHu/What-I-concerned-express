const mongoose = require('mongoose');
const pbkdf2Async = require('util').promisify(require('crypto').pbkdf2);
const HttpRequestParaError = require('../../errors/http_errors/http_request_param_error');

const { Schema } = mongoose;
const PasswordConfig = require('../../cipher/password_config');

const UserSchema = new Schema({
  name: { type: String, required: true, index: 1 },
  age: { type: Number, min: 0, max: 150 },
  username: { type: String, requited: true, unique: true },
  password: { type: String },
});

const UserModel = mongoose.model('user', UserSchema);

async function insert(user) {
  const created = await UserModel.create(user);
  return created;
}

async function getOneById(id) {
  const user = await UserModel.findOne({ _id: id }, { password: 0 });
  return user;
}

async function getOneByName(name) {
  const user = await UserModel.findOne({ name }, { password: 0 });
  return user;
}

async function list() {
  const match = {};
  const flow = UserModel.find(match);
  flow.select({ password: 0 });
  const user = await flow.exec();
  return user;
}

async function createUserByNamePass(user) {
  const usernameDupUser = await UserModel.findOne({
    $or: [
      { username: user.username },
      { name: user.name },
    ],
  }, { _id: 1 });
  if (usernameDupUser) { throw new HttpRequestParaError('username', '用户名或昵称已存在，请重试', `duplicate username: ${user.username}`); }
  // eslint-disable-next-line max-len
  const passToSave = await pbkdf2Async(user.password, PasswordConfig.SALT, PasswordConfig.ITERATION, PasswordConfig.KEY_LENGTH, PasswordConfig.DIGEST);
  const created = await insert({
    name: user.name,
    username: user.username,
    password: passToSave,
  });
  return {
    // eslint-disable-next-line no-underscore-dangle
    _id: created._id,
    username: created.username,
    name: created.name,
  };
}

async function getUserByNamePass(username, password) {
  const passToSave = await pbkdf2Async(password, PasswordConfig.SALT,
    PasswordConfig.ITERATION, PasswordConfig.DIGEST);
  const found = await UserModel.findOne({
    username,
    password: passToSave,
  }, {
    password: 0,
  });
  return found;
}

module.exports = {
  insert, getOneById, getOneByName, list, createUserByNamePass, getUserByNamePass,
};
