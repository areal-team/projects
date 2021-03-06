class CheckCredentials {
  constructor({
    logger,
    userModel,
  }) {
    this.logger = logger;
    this.userModel = userModel;
  }

  async get(params) {
    // this.logger.debug('CheckCredentials', params);
    const result = await this.userModel.findOne(params);
    if (!result) {
      return false;
    }
    delete (result.password);
    return result;
  }
}

module.exports = CheckCredentials;
