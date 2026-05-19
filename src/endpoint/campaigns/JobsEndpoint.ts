import { z } from 'zod';
import { Job, JobSchema } from '../../types/Job';
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
   * @param parent The parent `CampaignsEndpoint` whose `req`, `do`, and `qb` are
   *   reused.
   */
  constructor(parent: Endpoint) {
    super(parent);
  }

  /**
   * Returns the jobs for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The jobs.
   */
  public getAll = async (campaignId: string): Promise<Job[]> => {
    return await this.do.get(`/${campaignId}/jobs`, z.array(JobSchema));
  };
}
