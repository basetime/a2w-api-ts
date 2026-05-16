import { Requester } from '../http/Requester';
import { Campaign } from '../types/Campaign';
import { CampaignStats } from '../types/CampaignStats';
import { Claim } from '../types/Claim';
import { Enrollment, EnrollmentResponse } from '../types/Enrollment';
import { Job } from '../types/Job';
import { MetaValues } from '../types/MetaValues';
import { Pass } from '../types/Pass';
import Endpoint from './Endpoint';
import EndpointDo from './EndpointDo';

/**
 * Communicate with the campaigns endpoints.
 */
export default class CampaignsEndpoint extends Endpoint {
  /**
   * A function to encode the data into a jwt. Used by the enrollment endpoint.
   */
  public jwtEncode?: (data: Record<string, any>) => Promise<string>;

  /**
   * Verb wrapper for the unauthenticated enrollment endpoint (`/e`), which lives at a
   * different prefix from the rest of this class.
   */
  private enrollment: EndpointDo;

  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/campaigns');
    this.enrollment = new EndpointDo(req, '/e');
  }

  /**
   * Returns all of the campaigns for authenticated organization.
   *
   * @returns The campaigns.
   */
  public getAll = async (): Promise<Campaign[]> => {
    return await this.do.get('');
  };

  /**
   * Returns the details of a campaign.
   *
   * @param id The ID of the campaign.
   */
  public getById = async (id: string): Promise<Campaign> => {
    return await this.do.get(`/${id}`);
  };

  /**
   * Returns the passes for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The passes.
   */
  public getPasses = async (campaignId: string): Promise<Pass[]> => {
    return await this.do.get(`/${campaignId}/passes`);
  };

  /**
   * Returns the details for a pass.
   *
   * @param campaignId The campaign the pass belongs to.
   * @param passId The ID of the pass.
   * @param scanner Only used by scanners. The scanner that's being used to request the pass.
   */
  public getPass = async (campaignId: string, passId: string, scanner: any = ''): Promise<Pass> => {
    const url = this.qb.create('/{campaign}/passes/details/{pass}')
      .addParam('campaign', campaignId)
      .addParam('pass', passId)
      .addQuery('scanner', JSON.stringify(scanner));

    return await this.do.get(url);
  };

  /**
   * Queries the passes for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @param queries The queries to run.
   * @returns The passes.
   */
  public queryPasses = async (campaignId: string, queries: Record<string, any> = {}): Promise<Pass[]> => {
    const url = this.qb.create('/{campaign}/passes/query').addParam('campaign', campaignId);
    Object.entries(queries).forEach(([key, value]) => url.addQuery('query[]', `${key}:${value}`));

    return await this.do.get(url);
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
    body: Partial<
      Pick<Pass, 'objectStore' | 'templateId' | 'templateVersion' | 'passTypeIdentifier'>
    >,
  ): Promise<Pass> => {
    const cleaned = {
      objectStore: body.objectStore,
      templateId: body.templateId,
      templateVersion: body.templateVersion,
      passTypeIdentifier: body.passTypeIdentifier,
    };

    return await this.do.post(`/${campaignId}/passes/details/${passId}`, cleaned);
  };

  /**
   * Merges a pass object store into the existing object store.
   *
   * @param campaignId The ID of the campaign the pass belongs to.
   * @param passId The ID of the pass to merge.
   * @param body The new pass values with objectStore key.
   */
  public mergeObjectStore = async (campaignId: string, passId: string, body: Partial<
    Pick<Pass, 'objectStore'>
  >,): Promise<Pass> => {
    return await this.do.put(`/${campaignId}/passes/details/${passId}`, {
      objectStore: body.objectStore,
    });
  }

  /**
   * Deletes keys from a pass object store.
   *
   * @param campaignId The ID of the campaign the pass belongs to.
   * @param passId The ID of the pass to delete the keys from.
   * @param objectStoreKeys The keys to delete from the object store.
   */
  public deleteObjectStoreKeys = async (campaignId: string, passId: string, objectStoreKeys: string[]): Promise<Pass> => {
    return await this.do.del(`/${campaignId}/passes/details/${passId}`, true, { objectStoreKeys });
  }

  /**
   * Updates multiple passes.
   *
   * @param campaignId The ID of the campaign the passes belong to.
   * @param bodies The passes to update.
   */
  public updatePasses = async (
    campaignId: string,
    passes: (Partial<Pass> & { id: string })[],
  ): Promise<Pass[]> => {
    // Filter out the values that can't be updated via this endpoint.
    const cleaned = passes.map((pass: Partial<Pass> & { id: string }) => {
      return {
        id: pass.id,
        objectStore: pass.objectStore,
        templateId: pass.templateId,
        templateVersion: pass.templateVersion,
        passTypeIdentifier: pass.passTypeIdentifier,
      };
    });

    return await this.do.post(`/${campaignId}/passes/details/passes`, { passes: cleaned });
  };

  /**
   * Appends a log to a pass.
   *
   * @param campaignId The ID of the campaign the pass belongs to.
   * @param passId The ID of the pass.
   * @param log The message to append to the log.
   */
  public appendLog = async (campaignId: string, passId: string, log: string): Promise<Pass> => {
    return await this.do.post(`/${campaignId}/passes/${passId}/logs`, { log });
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
   * @param objectStore The object store to set.
   * @param utm The UTM values to pass along to the api.
   */
  public createBundle = async (
    campaignId: string,
    metaValues: MetaValues = {},
    objectStore: Record<string, any> = {},
    utm: Record<string, string> = {},
  ): Promise<string> => {
    return await this.do.post(`/${campaignId}/passes/bundle`, {
      metaValues,
      objectStore,
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

    return await this.enrollment.post(`/campaign/${campaignId}`, body);
  };

  /**
   * Returns the passes for a job.
   *
   * @param campaignId The ID of the campaign.
   * @param jobId The ID of the job.
   * @returns The passes.
   */
  public getPassesByJob = async (campaignId: string, jobId: string): Promise<Pass[]> => {
    return await this.do.get(`/${campaignId}/passes/${jobId}`);
  };

  /**
   * Returns the claims for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The claims.
   */
  public getClaims = async (campaignId: string): Promise<Claim[]> => {
    return await this.do.get(`/${campaignId}/claims`);
  };

  /**
   * Returns the jobs for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The jobs.
   */
  public getJobs = async (campaignId: string): Promise<Job[]> => {
    return await this.do.get(`/${campaignId}/jobs`);
  };

  /**
   * Returns statistics for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The statistics.
   */
  public getStats = async (campaignId: string): Promise<CampaignStats> => {
    return await this.do.get(`/${campaignId}/stats`);
  };

  /**
   * Returns the enrollments for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The enrollments.
   */
  public getEnrollments = async (campaignId: string): Promise<Enrollment[]> => {
    return await this.do.get(`/${campaignId}/enrollments`);
  };

  /**
   * Sets the redeemed status of a pass to true.
   *
   * @param campaignId The ID of the campaign.
   * @param passId The ID of the pass.
   * @returns True if the pass was redeemed, false if it was already redeemed.
   */
  public redeemPass = async (campaignId: string, passId: string): Promise<boolean> => {
    return await this.do.post(`/${campaignId}/passes/${passId}/redeemed`, {});
  };

  /**
   * Returns the redeemed status of a pass.
   *
   * @param campaignId The ID of the campaign.
   * @param passId The ID of the pass.
   * @returns The redeemed status.
   */
  public getRedeemedStatus = async (campaignId: string, passId: string): Promise<boolean> => {
    return await this.do.get(`/${campaignId}/passes/${passId}/redeemed`);
  };
}
