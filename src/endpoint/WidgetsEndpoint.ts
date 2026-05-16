import { getBaseUrl } from '../constants';
import { Requester } from '../http/Requester';

/**
 * Strips the `/api/v1` suffix from the configured API base URL so this endpoint can target
 * routes mounted at the site root.
 */
const getSiteBaseUrl = (): string => getBaseUrl().replace(/\/api\/v1\/?$/, '');

/**
 * Communicate with the `/widgets` endpoint.
 *
 * Accessed via `client.widgets`. The widgets routes live outside `/api/v1`, so this
 * endpoint bypasses the API prefix and targets the site root.
 *
 * The two JWT signing methods are convenient for server-side callers that need to mint
 * tokens for the campaign enrollment flow without re-implementing the signing logic.
 */
export default class WidgetsEndpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(private req: Requester) { }

  /**
   * Signs an arbitrary payload with an explicit secret and returns the JWT.
   *
   * @param payload The payload to sign.
   * @param secret The secret to sign with.
   */
  public signJwt = async (
    payload: Record<string, any>,
    secret: string,
  ): Promise<string> => {
    return await this.req.fetch<string>(
      `${getSiteBaseUrl()}/widgets/jwt`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload, secret }),
      },
      false,
    );
  };

  /**
   * Signs a payload using the campaign's stored `openEnrollmentJwtSecret`.
   *
   * The campaign must have an `openEnrollmentJwtSecret` configured; otherwise the
   * backend returns a 400.
   *
   * Pairs well with `client.campaigns.enrollments.create(...)`, which requires the
   * caller to inject a `jwtEncode` function. For example:
   *
   * ```ts
   * client.campaigns.enrollments.jwtEncode = (data) =>
   *   client.widgets.signCampaignJwt(campaignId, data);
   * ```
   *
   * @param campaignId The ID of the campaign whose secret should be used.
   * @param payload The payload to sign.
   */
  public signCampaignJwt = async (
    campaignId: string,
    payload: Record<string, any>,
  ): Promise<string> => {
    return await this.req.fetch<string>(
      `${getSiteBaseUrl()}/widgets/jwt/${encodeURIComponent(campaignId)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payload }),
      },
      false,
    );
  };
}
