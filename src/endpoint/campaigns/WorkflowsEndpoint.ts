import { z } from 'zod';
import {
  CampaignWorkflow,
  CampaignWorkflowInput,
  CampaignWorkflowSchema,
} from '../../types/CampaignWorkflow';
import Endpoint from '../Endpoint';

/**
 * Communicate with the `/campaigns/:campaignId/workflows` sub-endpoints.
 *
 * Accessed via `client.campaigns.workflows`. Methods take `campaignId` as their first
 * argument, matching the unbound style used elsewhere in the SDK.
 */
export default class CampaignWorkflowsEndpoint extends Endpoint {
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
   * Returns the workflows attached to a campaign.
   *
   * @param campaignId The ID of the campaign.
   */
  public getAll = async (campaignId: string): Promise<CampaignWorkflow[]> => {
    return await this.do.get(`/${campaignId}/workflows`, z.array(CampaignWorkflowSchema));
  };

  /**
   * Attaches a workflow to a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @param body The attachment body (workflow ID + runsWhen + optional schedule).
   */
  public attach = async (
    campaignId: string,
    body: CampaignWorkflowInput,
  ): Promise<CampaignWorkflow> => {
    return await this.do.post(`/${campaignId}/workflows`, body, CampaignWorkflowSchema);
  };

  /**
   * Updates an existing workflow attachment on a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @param workflowId The ID of the campaign workflow attachment to update.
   * @param body The updated `runsWhen` and optional schedule.
   */
  public update = async (
    campaignId: string,
    workflowId: string,
    body: Pick<CampaignWorkflowInput, 'runsWhen' | 'schedule'>,
  ): Promise<string> => {
    return await this.do.post(`/${campaignId}/workflows/${workflowId}`, body, z.string());
  };

  /**
   * Detaches a workflow from a campaign.
   *
   * Returns the remaining workflow attachments for the campaign.
   *
   * @param campaignId The ID of the campaign.
   * @param workflowId The ID of the campaign workflow attachment to detach.
   */
  public detach = async (
    campaignId: string,
    workflowId: string,
  ): Promise<CampaignWorkflow[]> => {
    return await this.do.del(
      `/${campaignId}/workflows/${workflowId}`,
      z.array(CampaignWorkflowSchema),
    );
  };
}
