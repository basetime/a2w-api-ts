import { z } from 'zod';
import { Claim, ClaimSchema } from '../../types/Claim';
import Endpoint from '../Endpoint';

/**
 * Communicate with the `/campaigns/:campaignId/claims` sub-endpoint.
 *
 * Accessed via `client.campaigns.claims`. Distinct from the top-level
 * {@link ../ClaimsEndpoint | ClaimsEndpoint} which handles `/claim` (pkpass downloads).
 */
export default class CampaignClaimsEndpoint extends Endpoint {
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
   * Returns the claims for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The claims.
   */
  public getAll = async (campaignId: string): Promise<Claim[]> => {
    return await this.do.get(`/${campaignId}/claims`, z.array(ClaimSchema));
  };
}
