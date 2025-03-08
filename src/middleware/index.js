const authJwt = require('./auth.middleware');
const errorHandler = require('./error.middleware');
const validate = require('./validation.middleware');

module.exports = {
  authJwt,
  errorHandler,
  validate,
};