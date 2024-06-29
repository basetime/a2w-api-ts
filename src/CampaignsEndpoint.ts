import Endpoint from './Endpoint';
import { Pass } from './Pass';

/**
 * Communicate with the campaigns endpoints.
 */
export default class CampaignsEndpoint extends Endpoint {
  /**
   *
   * @param campaignId The ID of the campaign.
   */
  public getPasses = async (campaignId: string): Promise<Pass> => {
    const token = await this.getBearerToken();
    console.log(token);

    return Promise.resolve({} as Pass);
  };
}
