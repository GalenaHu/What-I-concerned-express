const express = require('express');
const UserService = require('../../services/user_service');
const logger = require('../../utils/loggers/logger');
const apiRes = require('../../utils/api_response');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/', (req, res, next) => {
  (async () => {
    const users = await UserService.getAllUsers();
    return { users };
  })().then((r) => {
    res.data = r;
    apiRes(req, res);
  }).catch((e) => {
    next(e);
  });
});
router.post('/', (req, res, next) => {
  (async () => {
    const { username, password, name } = req.body;
    const result = await UserService.addNewUser({ username, password, name });
    return result;
  })().then((r) => {
    const infoMeta = {
      query: req.query,
      url: req.originalUrl,
      userInfo: req.user,
    };
    logger.info(res.message, infoMeta);
    res.data = r;
    apiRes(req, res);
  }).catch((e) => {
    next(e);
  });
});

router.get('/:userId', (req, res, next) => {
  (async () => {
    const users = await UserService.getUserById(req.params.userId);
    return users;
  })().then((r) => {
    res.data = r;
    apiRes(req, res);
  }).catch((e) => {
    console.log(e);
    next(e);
  });
});

router.post('/:userId/subscription', auth(), (req, res, next) => {
  (async () => {
    const sub = UserService.createSubscription(req.params.userId, req.body.url);
    return sub;
  })().then((r) => {
    res.data = r;
    apiRes(req, res);
  }).then((e) => {
    next(e);
  });
});

module.exports = router;
