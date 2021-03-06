/* eslint-disable class-methods-use-this */
import axios from 'axios';
import EventEmitter from 'eventemitter3';

function stringify(data) {
  return Object.keys(data).map(k => `${encodeURIComponent(k)}=${encodeURIComponent(data[k])}`).join('&');
}

class Client extends EventEmitter {
  constructor({
    token, urls, server, httpClient, tokenNames,
  }) {
    super();

    this.token = token;
    this.client = httpClient || axios.create();
    this.urls = urls || {
      login: 'auth/login',
      refreshToken: 'auth/refreshToken',
    };
    this.server = server || {
      prefix: '/api/v1/',
      timeout: 30000,
    };

    this.tokenNames = tokenNames || {
      token: 'token',
      refreshToken: 'refreshToken',
    };

    // this.requests = [];
  }

  /**
  * @param {Object} credentials
  * @config {Object} credentials
  * @config { data: credentials, form: true }
  * @param {Boolean} needToSave
  * @example
  *   // for body params
  *   login({ login: 'foo', password: 'bar' })
  *   // for x-www-form-urlencoded params
  *   login({ data: { login: 'foo', password: 'bar' }, form: true })
  */
  async login(credentials, needToSave) {
    const params = (credentials && credentials.form)
      ? credentials
      : { data: credentials };
    // console.log('api login', params);
    return new Promise(async resolve => {
      const data = await this.post(this.urls.login, params);
      // console.log('login data', data);
      this.setNeedToSave(needToSave);
      this.updateTokens(this.getTokensObject(data));
      resolve(data);
    });
  }

  logout() {
    this.setNeedToSave(true);
    this.updateTokens({
      token: null,
      refreshToken: null,
    });
  }

  getTokensObject(tokens) {
    return {
      token: tokens[this.tokenNames.token],
      refreshToken: tokens[this.tokenNames.refreshToken],
    };
  }

  setNeedToSave(needToSave) {
    this.token.setNeedToSave(needToSave);
  }

  updateTokens({ token, refreshToken }) {
    this.token.token = token;
    this.token.refreshToken = refreshToken;
  }

  post(uri, config, cb) {
    return this.request('post', uri, config, cb);
  }

  get(uri, config, cb) {
    return this.request('get', uri, config, cb);
  }

  request(method, uri, config, cb) {
    const self = this;
    return new Promise(async (resolve, reject) => {
      self.validateRequest(method, uri);

      const params = self.getParams(method, uri, config);

      let response = null;
      try {
        response = await self.client.request(params);
      } catch (error) {
        // console.log('request error', error, self.token);
        if (!error.response || (error.response.status !== 401)) {
          return reject(error);
        }

        if (!self.urls.refreshToken || !self.token.refreshToken) {
          self.emit('Unauthorized');
          return resolve();
        }

        // self.addRequestToQueue({
        //   method, uri, config, cb,
        // });
        this.on('refreshToken', async () => {
          const result = await self.request(method, uri, config, cb);
          resolve(result);
        });
        self.getRefreshToken();
        return null;
      }
      // console.log({ response });

      if (response) {
        // console.log(1);

        // if (response.data.status && response.data.status !== 'ok') {
        //   console.log(2);
        //   return resolve();
        // }
        // console.log(3);
        return resolve(response.data.data ? response.data.data : response.data);
      }
      // console.log(4);
      return resolve();
    });
  }

  validateRequest(method, uri) {
    if (!method) {
      throw new Error('API function call requires method argument');
    }

    if (!uri) {
      throw new Error('API function call requires uri argument');
    }
  }

  getParams(method, uri, config) {
    // eslint-disable-next-line no-param-reassign
    config = config || { data: null };

    const url = (uri.substr(0, 4) === 'http')
      ? uri
      : this.server.prefix + uri;

    const params = {
      method,
      url,
      data: config.data || null,
      headers: {},
      timeout: config.timeout || this.server.timeout,
    };

    if (uri !== this.urls.refreshToken && this.token.token) {
      params.headers.Authorization = `Bearer ${this.token.token}`;
    }

    if (uri === this.urls.refreshToken && this.token.refreshToken) {
      params.headers.Authorization = `Bearer ${this.token.refreshToken}`;
    }

    if (config.form) {
      params.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      params.data = stringify(params.data);
    }
    return params;
  }

  // addRequestToQueue(request) {
  //   this.requests.push(request);
  // }

  async getRefreshToken() {
    if (this.refreshRequest) {
      return;
    }
    this.refreshRequest = true;

    if (!this.token.refreshToken) {
      this.emit('Unauthorized');
      return;
    }

    let data = null;
    try {
      data = await this.post(this.urls.refreshToken);
    } catch (error) {
      // console.log('getRefreshToken error', error);
      return;
    }
    this.updateTokens(data);
    // this.executeRequests();
    this.refreshRequest = false;
    this.emit('refreshToken', data.user);
  }
  // executeRequests() {
  //   let request = null;
  //   // eslint-disable-next-line no-cond-assign
  //   while (request = this.requests.shift()) {
  //     this.request(request.method, request.uri, request.config, request.cb);
  //   }
  // }
}

export default Client;
