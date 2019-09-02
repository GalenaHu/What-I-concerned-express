const mongoose = require('mongoose');
const logger = require('../utils/loggers/logger');
const mongoSetting = require('../setting').mongo;

mongoose.Promise = Promise;
mongoose.set('useCreateIndex', true);

const { uri } = mongoSetting;
mongoose.connect(uri, { useNewUrlParser: true });
const db = mongoose.connection;


db.on('open', () => {
  logger.info('db connected');
});

db.on('error', (e) => {
  logger.error(e);
});

module.exports = db;
