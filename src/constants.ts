/**
 * The base URL for all requests to the API.
 */
export const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'https://local.addtowallet.io:5009/api/v1'
    : 'https://app.addtowallet.io/api/v1';
