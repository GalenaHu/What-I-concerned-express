const mongoose = require('mongoose');
// require('../services/mongoose_service');

const { Schema } = mongoose;

const urlSechema = new Schema({
  source: { type: String },
  url: { type: String },
});

const versionSechema = new Schema({
  dramaId: { type: Number },
  engTitle: { type: String },
  chsTitle: { type: String },
  title: { type: String },
  size: { type: String },
  createAt: { type: Date },
  accessCode: { type: String },
  url: [urlSechema],
});

const seasonSechema = new Schema({
  dramaId: { type: Number },
  engTitle: { type: String },
  chsTitle: { type: String },
  seasonId: { type: Number },
  version: [versionSechema],
});

const dramaSechema = new Schema({
  dramaId: { type: Number },
  engTitle: { type: String },
  chsTitle: { type: String },
  info: { type: String },
  season: [seasonSechema],
});

const dramaModel = mongoose.model('drama', dramaSechema);


async function getOneById(id) {
  const result = await dramaModel.findOne({ dramaId: id }, (err, drama) => drama);
  return result;
}
async function getOneByName(name) {
  const result = await dramaModel.findOne({ chsTitle: name }, (err, drama) => drama);
  return result;
}
async function getRandomDrama(num) {
  const result = [];
  let i = 0;
  while (i < num) {
    const id = Math.floor(Math.random() * 2500);
    const item = await getOneById(id);
    if (item) {
      if (!item.info && item.chsTitle) {
        result.push(item);
        i++;
      }
    }
  }
  return result;
}


module.exports = {
  getOneById,
  getOneByName,
  getRandomDrama,
};
