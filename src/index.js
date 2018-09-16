// Custom API error to throw
function ApiError(message, data, status) {
  let response = null;
  let isObject = false;

  // We are trying to parse response
  try {
    response = JSON.parse(data);
    isObject = true;
  } catch (e) {
    response = data;
  }

  this.response = response;
  this.message = message;
  this.status = status;
  /* eslint-disable no-unused-vars */
  const toString = () => (
    `${this.message}\nResponse:\n${isObject ? JSON.stringify(this.response, null, 2) : this.response}`
  );
  /* eslint-enable no-unused-vars */
}


class Resource {
  PATH = null
  BASE_URL = 'https://api.loadlab.co/v1'

  constructor(token, userOptions = {}) {
    const defaultOptions = {};
    const defaultHeaders = {
      Accept: 'application/json',
      Authorization: `Token ${token}`
    };
    this.options = {
      // Merge options
      ...defaultOptions,
      ...userOptions,
      // Merge headers
      headers: {
        ...defaultHeaders,
        ...userOptions.headers,
      },
    };
  }

  get = () => {
    let response = null;
    const url = this.BASE_URL + this.PATH;

    return fetch(url, this.options).then((responseObject) => {
      response = responseObject;

      // HTTP unauthorized
      if (response.status === 401) {
        // Handle unauthorized requests
        // Maybe redirect to login page?
      }

      if (response.status < 200 || response.status >= 300) {
        return response.text();
      }
      return response.json();
    })
      .then((parsedResponse) => {
        if (response.status < 200 || response.status >= 300) {
          throw parsedResponse;
        }
        return parsedResponse;
      })
      .catch((error) => {
        if (response) {
          throw new ApiError(`Request failed with status ${response.status}.`, error, response.status);
        } else {
          throw new ApiError(error.toString(), null, 'REQUEST_FAILED');
        }
      });
  }
}

class Jobs extends Resource {
  PATH = '/jobs/'
}

class Plans extends Resource {
  PATH = '/plans/'
}

class Sites extends Resource {
  PATH = '/sites/'
}


class LoadLab {
  constructor(token) {
    this.jobs = new Jobs(token);
    this.plans = new Plans(token);
    this.sites = new Sites(token);
  }
}

export default LoadLab;
