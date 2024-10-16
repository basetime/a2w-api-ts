import { Campaign } from '../types/Campaign';
import { CampaignStats } from '../types/CampaignStats';
import { Claim } from '../types/Claim';
import { Enrollment } from '../types/Enrollment';
import { Job } from '../types/Job';
import { MetaValues } from '../types/MetaValues';
import { Pass } from '../types/Pass';
import Endpoint from './Endpoint';

/**
 * The campaigns endpoint.
 */
const endpoint = '/campaigns';

/**
 * Communicate with the campaigns endpoints.
 */
export default class CampaignsEndpoint extends Endpoint {
  /**
   * Returns all of the campaigns for authenticated organization.
   *
   * @returns The campaigns.
   */
  public getAll = async (): Promise<Campaign[]> => {
    return await this.doGet<Campaign[]>(endpoint);
  };

  /**
   * Returns the details of a campaign.
   *
   * @param id The ID of the campaign.
   */
  public getById = async (id: string): Promise<Campaign> => {
    return await this.doGet<Campaign>(`${endpoint}/${id}`);
  };

  /**
   * Returns the passes for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The passes.
   */
  public getPasses = async (campaignId: string): Promise<Pass[]> => {
    return await this.doGet<Pass[]>(`${endpoint}/${campaignId}/passes`);
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
    const url = `${endpoint}/${campaignId}/passes/details/${passId}?scanner=${scannerStr}`;

    return await this.doGet<Pass>(url);
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
    const url = `${endpoint}/${campaignId}/passes/bundle`;

    return await this.doPost<string>(url, {
      metaValues,
      formValues,
      utm,
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
    return await this.doGet<Pass[]>(`${endpoint}/${campaignId}/passes/${jobId}`);
  };

  /**
   * Returns the claims for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The claims.
   */
  public getClaims = async (campaignId: string): Promise<Claim[]> => {
    return await this.doGet<Claim[]>(`${endpoint}/${campaignId}/claims`);
  };

  /**
   * Returns the jobs for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The jobs.
   */
  public getJobs = async (campaignId: string): Promise<Job[]> => {
    return await this.doGet<Job[]>(`${endpoint}/${campaignId}/jobs`);
  };

  /**
   * Returns statistics for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The statistics.
   */
  public getStats = async (campaignId: string): Promise<CampaignStats> => {
    return await this.doGet<CampaignStats>(`${endpoint}/${campaignId}/stats`);
  };

  /**
   * Returns the enrollments for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The enrollments.
   */
  public getEnrollments = async (campaignId: string): Promise<Enrollment[]> => {
    return await this.doGet<Enrollment[]>(`${endpoint}/${campaignId}/enrollments`);
  };
}
