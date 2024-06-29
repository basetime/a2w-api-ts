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
    console.log(campaignId);

    return Promise.resolve({} as Pass);
  };
}
