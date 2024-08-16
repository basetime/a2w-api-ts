import { CampaignStats } from './CampaignStats';
import { Claim } from './Claim';
import Endpoint from './Endpoint';
import { Enrollment } from './Enrollment';
import { Job } from './Job';
import { MetaValues } from './MetaValues';
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

    return await this.req.fetch<Pass[]>(url, {
      method: 'GET',
    });
  };

  /**
   * Returns the details for a pass.
   *
   * @param campaignId The campaign the pass belongs to.
   * @param passId The ID of the pass.
   * @param scanner The scanner that's being used to request the pass.
   */
  public getPass = async (campaignId: string, passId: string, scanner: any = ''): Promise<Pass> => {
    const scannerStr = encodeURIComponent(JSON.stringify(scanner));
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/passes/details/${passId}?scanner=${scannerStr}`;

    return await this.req.fetch<Pass>(url, {
      method: 'GET',
    });
  };

  /**
   * Creates a pass bundle and returns the URL to the claims page.
   *
   * Example:
   * ```ts
   * const client = new Client(auth, console);
   * const link = await client.campaigns.createBundle('123');
   * console.log(link);
   * ```
   *
   * @param campaignId The campaign the pass belongs to.
   * @param metaValues The meta values to set.
   * @param formValues The form values to set.
   * @param utm The UTM values to pass along to the api.
   */
  public createBundle = async (
    campaignId: string,
    metaValues: MetaValues = {},
    formValues: Record<string, any> = {},
    utm: Record<string, string> = {},
  ): Promise<string> => {
    const url = `${CampaignsEndpoint.endpoint}/${campaignId}/passes/bundle`;
    const opts: RequestInit = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metaValues,
        formValues,
        utm,
      }),
    };

    return await this.req.fetch<string>(url, opts);
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

    return await this.req.fetch<Pass[]>(url, {
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

    return await this.req.fetch<Claim[]>(url, {
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

    return await this.req.fetch<Job[]>(url, {
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

    return await this.req.fetch<CampaignStats>(url, {
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

    return await this.req.fetch<Enrollment[]>(url, {
      method: 'GET',
    });
  };
}
