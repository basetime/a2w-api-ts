import { CampaignStats } from './CampaignStats';
import { Claim } from './Claim';
import Endpoint from './Endpoint';
import { Enrollment } from './Enrollment';
import { Job } from './Job';
import { Pass } from './Pass';

/**
 * Communicate with the campaigns endpoints.
 */
export default class CampaignsEndpoint extends Endpoint {
  /**
   * The endpoint.
   */
  public static readonly endpoint = '/campaigns';

  /**
   * Returns the passes for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The passes.
   */
  public getPasses = async (campaignId: string): Promise<Pass[]> => {
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/passes`;

    return await this.req.do<Pass[]>(url, {
      method: 'GET',
    });
  };

  /**
   * Returns the passes for a job.
   *
   * @param campaignId The ID of the campaign.
   * @param jobId The ID of the job.
   * @returns The passes.
   */
  public getPassesByJob = async (campaignId: string, jobId: string): Promise<Pass[]> => {
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/passes/${jobId}`;

    return await this.req.do<Pass[]>(url, {
      method: 'GET',
    });
  };

  /**
   * Returns the claims for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The claims.
   */
  public getClaims = async (campaignId: string): Promise<Claim[]> => {
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/claims`;

    return await this.req.do<Claim[]>(url, {
      method: 'GET',
    });
  };

  /**
   * Returns the jobs for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The jobs.
   */
  public getJobs = async (campaignId: string): Promise<Job[]> => {
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/jobs`;

    return await this.req.do<Job[]>(url, {
      method: 'GET',
    });
  };

  /**
   * Returns statistics for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The statistics.
   */
  public getStats = async (campaignId: string): Promise<CampaignStats> => {
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/stats`;

    return await this.req.do<CampaignStats>(url, {
      method: 'GET',
    });
  };

  /**
   * Returns the enrollments for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The enrollments.
   */
  public getEnrollments = async (campaignId: string): Promise<Enrollment[]> => {
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/enrollments`;

    return await this.req.do<Enrollment[]>(url, {
      method: 'GET',
    });
  };
}
