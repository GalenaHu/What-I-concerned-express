const Drama = require('../models/mongoose/drama');
require('../services/mongodb_connection');


async function getContent(tab, param) {
  if (tab === 'drama') {
    const result = await Drama.getOneByName(param);
    return result;
  }
  return {
    info: 'no such tab',
  };
}

async function getRecommend(num) {
  const result = await Drama.getRandomDrama(num);
  return {
    recommendDrama: result,
  };
}

module.exports = {
  getContent,
  getRecommend,
};

// getContent('drama', '风骚律师').then((r) => {
//   console.log(r);
// });
