import Endpoint from './Endpoint';

/**
 * Communicate with the claims endpoints.
 */
export default class ClaimsEndpoint extends Endpoint {
  /**
   * The endpoint.
   */
  public static readonly endpoint = '/claim';

  /**
   * Returns the pkpass file for a campaign and pass.
   *
   * @param campaignId The ID of the campaign.
   * @param passId The ID of the pass.
   * @returns The pkpass file.
   */
  public getPkpass = async (campaignId: string, passId: string): Promise<string> => {
    const url = `${ClaimsEndpoint.endpoint}/${campaignId}/${passId}.pkpass`;

    return await this.req.do<string>(url, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.apple.pkpass',
      },
    });
  };

  /**
   * Returns debugging information for a campaign and pass.
   *
   * @param campaignId The ID of the campaign.
   * @param passId The ID of the pass.
   * @returns Debugging information.
   */
  public debugJson = async (campaignId: string, passId: string): Promise<object> => {
    const url = `${ClaimsEndpoint.endpoint}/${campaignId}/${passId}/debugDownloadJson`;

    return await this.req.do<object>(url, {
      method: 'GET',
    });
  };
}
