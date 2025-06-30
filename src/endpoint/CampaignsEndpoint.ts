import { Campaign } from '../types/Campaign';
import { CampaignStats } from '../types/CampaignStats';
import { Claim } from '../types/Claim';
import { Enrollment, EnrollmentResponse } from '../types/Enrollment';
import { Job } from '../types/Job';
import { MetaValues } from '../types/MetaValues';
import { Pass } from '../types/Pass';
import Endpoint from './Endpoint';

/**
 * The campaigns endpoint.
 */
const endpoint = '/campaigns';

/**
 * The enrollment endpoint.
 */
const enrollmentEndpoint = '/e';

/**
 * Communicate with the campaigns endpoints.
 */
export default class CampaignsEndpoint extends Endpoint {
  /**
   * A function to encode the data into a jwt. Used by the enroolment endpoint.
   */
  public jwtEncode?: (data: Record<string, any>) => Promise<string>;

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
   * Updates the details of a pass.
   *
   * This method also updates the wallets that contain the pass.
   *
   * @param campaignId The ID of the campaign the pass belongs to.
   * @param passId The ID of the pass.
   * @param body The new pass values.
   */
  public updatePass = async (
    campaignId: string,
    passId: string,
    body: Partial<Pick<Pass, 'data' | 'templateId' | 'templateVersion' | 'passTypeIdentifier'>>,
  ): Promise<Pass> => {
    const url = `${endpoint}/${campaignId}/passes/details/${passId}`;

    return await this.doPost<Pass>(url, body);
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
   * Creates an enrollment for a campaign, and returns the bundle ID and any errors.
   *
   * This method needs to encode the data into a jwt. The jwt is used to authenticate
   * with the site. This method requires the jwtEncode function to be set.
   *
   * @param campaignId The ID of the campaign.
   * @param metaValues The meta values to set.
   * @param formValues The form values to set.
   */
  public createEnrollment = async (
    campaignId: string,
    metaValues: MetaValues = {},
    formValues: Record<string, any> = {},
  ): Promise<EnrollmentResponse> => {
    if (!this.jwtEncode) {
      throw new Error(
        'CampaignsEndpoint.createEnrollment() requires the jwtEncode function to be set.',
      );
    }

    const body = {
      d: await this.jwtEncode({
        metaValues,
        formValues,
      }),
    };
    const url = `${enrollmentEndpoint}/campaign/${campaignId}`;

    return await this.doPost<EnrollmentResponse>(url, body);
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

  /**
   * Sets the redeemed status of a pass to true.
   *
   * @param campaignId The ID of the campaign.
   * @param passId The ID of the pass.
   * @returns The string 'ok' if the pass was redeemed.
   */
  public redeemPass = async (campaignId: string, passId: string): Promise<string> => {
    const url = `${endpoint}/${campaignId}/passes/${passId}/redeemed`;

    return await this.doPost<string>(url, {});
  };

  /**
   * Returns the redeemed status of a pass.
   *
   * @param campaignId The ID of the campaign.
   * @param passId The ID of the pass.
   * @returns The redeemed status.
   */
  public getRedeemedStatus = async (campaignId: string, passId: string): Promise<boolean> => {
    const url = `${endpoint}/${campaignId}/passes/${passId}/redeemed`;

    return await this.doGet<boolean>(url);
  };
}
