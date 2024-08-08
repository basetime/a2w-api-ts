/**
 * Base url when explicitly set.
 */
let baseUrl: string | undefined = undefined;

/**
 * Returns the base URL for all requests to the API.
 *
 * @returns The base URL for all requests to the API.
 */
export const getBaseUrl = () => {
  if (baseUrl) {
    return baseUrl;
  }

  if (process.env.NODE_ENV === 'development') {
    return 'https://local.addtowallet.io:5009/api/v1';
  }

  return 'https://app.addtowallet.io/api/v1';
};

/**
 * Sets the base URL for all requests to the API.
 *
 * @param url The base URL for all requests to the API.
 */
export const setBaseUrl = (url: string) => {
  baseUrl = url;
};
