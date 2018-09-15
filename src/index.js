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
  static PATH = null
  static BASE_URL = 'https://api.loadlab.co/v1'

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
    // Variable which will be used for storing response
    let response = null;

    const url = this.BASE_URL + this.PATH;

    return fetch(url, this.options).then((responseObject) => {
      // Saving response for later use in lower scopes
      response = responseObject;

      // HTTP unauthorized
      if (response.status === 401) {
        // Handle unauthorized requests
        // Maybe redirect to login page?
      }

      // Check for error HTTP error codes
      if (response.status < 200 || response.status >= 300) {
        // Get response as text
        return response.text();
      }

      // Get response as json
      return response.json();
    })
    // "parsedResponse" will be either text or javascript object depending if
    // "response.text()" or "response.json()" got called in the upper scope
      .then((parsedResponse) => {
        // Check for HTTP error codes
        if (response.status < 200 || response.status >= 300) {
          // Throw error
          throw parsedResponse;
        }

        // Request succeeded
        return parsedResponse;
      })
      .catch((error) => {
        // Throw custom API error
        // If response exists it means HTTP error occurred
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
