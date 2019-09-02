const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const SubSchema = new Schema({
  userId: { type: String, required: true },
  url: { type: String, required: true },
});

const SubModel = mongoose.model('Subscriptions', SubSchema);

async function list() {
  const match = {};
  const flow = SubModel.find(match);
  const s = await flow.exec();
  return s;
}

async function insert(sub) {
  const s = await SubModel.create(sub);
  return s;
}

async function findByUserId(userId) {
  const s = await SubModel.findOne({ userId });
  return s;
}


module.exports = {
  insert, findByUserId, list,
};
