import { z } from 'zod';
import { Requester } from '../http/Requester';
import Endpoint from './Endpoint';

/**
 * Body accepted by {@link WidgetsEndpoint.signCampaignJwt}.
 */
export interface WidgetsCampaignJwtPayload {
  /**
   * The meta values forwarded to the widget.
   */
  metaValues?: Record<string, unknown>;

  /**
   * The form values pre-filled in the widget.
   */
  formValues?: Record<string, unknown>;
}

/**
 * Communicate with the `/widgets` endpoint.
 *
 * Accessed via `client.widgets`. The widgets routes live outside `/api/v1`, so this
 * endpoint is constructed with `{ siteRoot: true }` — the inherited `this.do` builds
 * absolute URLs against the requester's current site base URL.
 */
export default class WidgetsEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/widgets', { siteRoot: true });
  }

  /**
   * Signs an arbitrary payload as a JWT using a caller-supplied secret.
   *
   * Returns the signed JWT as a string. Sent unauthenticated because the secret is what
   * the backend uses to sign — the caller's API key is not involved.
   *
   * @param payload The payload to sign.
   * @param secret The HMAC secret used to sign the JWT.
   */
  public signJwt = async (payload: Record<string, unknown>, secret: string): Promise<string> => {
    return await this.do.post('/jwt', { payload, secret }, z.string(), false);
  };

  /**
   * Signs a campaign-scoped payload as a JWT.
   *
   * The backend signs with the campaign's `openEnrollmentJwtSecret`, so no client-side
   * secret is required.
   *
   * @param campaignId The ID of the campaign whose JWT secret should be used.
   * @param payload The payload to sign.
   */
  public signCampaignJwt = async (
    campaignId: string,
    payload: WidgetsCampaignJwtPayload,
  ): Promise<string> => {
    const url = this.qb.create('/jwt/{campaign}').addParam('campaign', campaignId);
    return await this.do.post(url, { payload }, z.string(), false);
  };
}
