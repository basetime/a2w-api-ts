import { Requester } from '../../http/Requester';
import { Job } from '../../types/Job';
import Endpoint from '../Endpoint';

/**
 * Communicate with the `/campaigns/:campaignId/jobs` sub-endpoint.
 *
 * Accessed via `client.campaigns.jobs`.
 */
export default class CampaignJobsEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/campaigns');
  }

  /**
   * Returns the jobs for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The jobs.
   */
  public getAll = async (campaignId: string): Promise<Job[]> => {
    return await this.do.get(`/${campaignId}/jobs`);
  };
}
