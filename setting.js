const Production = {
  logger: {
    path: '/var/logs/spider',
  },
  mongo: {
    uri: 'mongodb://localhost:27017/data',
  },
};

const Debug = {
  logger: {
    path: '/logs',
  },
  mongo: {
    uri: 'mongodb://localhost:27017/data',
  },
};

if (process.env.NODE_ENV === 'production') {
  module.exports = Production;
} else {
  module.exports = Debug;
}
