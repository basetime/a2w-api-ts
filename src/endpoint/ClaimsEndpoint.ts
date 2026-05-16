import { Requester } from '../http/Requester';
import Endpoint from './Endpoint';

/**
 * Communicate with the claims endpoints.
 */
export default class ClaimsEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/claim');
  }

  /**
   * Returns the pkpass file for a campaign and pass.
   *
   * @param campaignId The ID of the campaign.
   * @param passId The ID of the pass.
   * @returns The pkpass file.
   */
  public getPkpass = async (campaignId: string, passId: string): Promise<string> => {
    const url = this.qb.create('/{campaign}/{pass}.pkpass')
      .addParam('campaign', campaignId)
      .addParam('pass', passId);

    return await this.do.fetch<string>(url, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.apple.pkpass',
      },
    });
  };
}
