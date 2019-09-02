const axios = require('axios');
const Spider = require('../models/mongoose/spider');
const logger = require('../utils/loggers/logger');
const HTTPReqParamError = require('../errors/http_errors/http_request_param_error');
const HTTPBaseError = require('../errors/http_errors/http_base_error');

async function registerSpider(spider) {
  const validations = {
    name: (name) => {
      if (!name) {
        throw new HTTPReqParamError(
          'spider service name',
          '名字不能为空',
          'a spider service name can not be empty',
        );
      }
    },
    validationUrl: (url) => {
      if (!url) {
        throw new HTTPReqParamError(
          'spider service validation url',
          '验证URL不能为空',
          'a spider service validation url can not be empty',
        );
      }
      if (url.indexOf('http') === -1) {
        throw new HTTPReqParamError(
          'spider service validation url',
          '非法的URL',
          'a spider service validation url must be a valid url',
        );
      }
    },
  };

  const keys = Object.keys(validations);
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    validations[k](spider[k]);
  }

  const res = await axios.get(spider.validationUrl).catch((e) => {
    logger.error(
      'error validating spider service on provided validation url',
      {
        errMsg: e.message,
        errStack: e.stack,
      },
    );
    throw new HTTPBaseError(
      400,
      '服务验证失败，请检查爬虫服务是否可用',
      40000200,
      'error validating spider validation url',
    );
  });

  if (res && res.data) {
    const spiderServiceResponseValidation = {
      code: (code) => {
        if (code !== 0) {
          throw new HTTPBaseError(
            400,
            `爬虫服务返回错误码: ${code}`,
            40000201,
            'spider service returns a error code',
          );
        }
      },
      protocol: (protocol) => {
        if (!protocol) {
          throw new HTTPBaseError(
            400,
            '协议错误: 空的协议',
            40000202,
            'spider validation url can not return a empty protocol obj',
          );
        }
        if (protocol.name !== 'FULL_NET_SPIDER_PROTOCOL') {
          throw new HTTPBaseError(
            400,
            `协议错误: 错误的版本${protocol.name}`,
            40000203,
            `invalid spider service protocol name ${protocol.name}`,
          );
        }
        if (protocol.version !== '0.1') {
          throw new HTTPBaseError(
            400,
            `协议错误: 错误的版本${protocol.version}`,
            40000204,
            `invalid spider service protocol version ${protocol.version}`,
          );
        }
      },
      config: (config) => {
        if (!config) {
          throw new HTTPBaseError(
            400,
            '协议错误: 空的配置',
            40000205,
            'spider validation url can not return a empty config obj',
          );
        }
        if (!config.contentList) {
          throw new HTTPBaseError(
            400,
            '协议错误: 空的配置',
            40000205,
            'spider validation url can not return a empty config obj',
          );
        }
        if (!config.contentList) {
          throw new HTTPBaseError(
            400,
            '配置错误: 空的列表接口',
            40000206,
            'spider validation url can not return a empty content list obj',
          );
        }
        if (!config.contentList.url || !config.contentList.pageSizeLimit
            || !config.contentList.frequencyLimit) {
          throw new HTTPBaseError(
            400,
            '配置错误：不完整的contentList对象',
            40000207,
            'spider validation url has to return a valid config content list obj',
          );
        }
      },
    };

    const resKeys = Object.keys(spiderServiceResponseValidation);
    for (let i = 0; i < resKeys.length; i += 1) {
      const k = resKeys[i];
      spiderServiceResponseValidation[k](res.data[k]);
    }
  }

  const toCreate = {
    name: spider.name,
    validationUrl: spider.validationUrl,
    contentList: res.data.config.contentList,
    singleContent: res.data.config.singleContent,
    status: 'validated',
  };

  const createdSpider = await Spider.registerSpider(toCreate);
  return createdSpider;
}
module.exports = {
  registerSpider,
};
