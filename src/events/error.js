module.exports = {
  name: 'error',

  execute(error, logger) {
    logger.error('Error general del cliente Discord', error);
  }
};
