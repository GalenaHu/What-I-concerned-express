const express = require('express');
const cors = require('cors');
const apiRes = require('../utils/api_response');
const Drama = require('../services/content_service');

const app = express();
const router = express.Router();
app.use(cors());

const corsOptions = {
  origin: 'http://localhost:8081',
  optionsSuccessStatus: 200,
};

router.get('/', cors(corsOptions), (req, res, next) => {
  (async () => {
    const { tab, name } = req.query;
    const result = await Drama.getContent(tab, name);
    return result;
  })().then((r) => {
    res.data = r;
    apiRes(req, res);
  }).catch((e) => {
    next(e);
  });
});

module.exports = router;
