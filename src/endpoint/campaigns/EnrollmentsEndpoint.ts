import { Requester } from '../../http/Requester';
import { Enrollment, EnrollmentResponse } from '../../types/Enrollment';
import { MetaValues } from '../../types/MetaValues';
import Endpoint from '../Endpoint';
import EndpointDo from '../EndpointDo';

/**
 * Communicate with the enrollment endpoints.
 *
 * Accessed via `client.campaigns.enrollments`. Reads live under `/campaigns/:id/enrollments`
 * (handled via the inherited `this.do`); writes hit the unauthenticated `/e/campaign/:id`
 * route via a dedicated {@link EndpointDo} instance.
 */
export default class CampaignEnrollmentsEndpoint extends Endpoint {
  /**
   * A function to encode the data into a jwt. Used by {@link create}.
   *
   * Callers must set this before invoking {@link create}, otherwise that method throws.
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
   * Returns the enrollments for a campaign.
   *
   * @param campaignId The ID of the campaign.
   * @returns The enrollments.
   */
  public getAll = async (campaignId: string): Promise<Enrollment[]> => {
    return await this.do.get(`/${campaignId}/enrollments`);
  };

  /**
   * Creates an enrollment for a campaign, and returns the bundle ID and any errors.
   *
   * This method needs to encode the data into a jwt. The jwt is used to authenticate
   * with the site. This method requires {@link jwtEncode} to be set.
   *
   * @param campaignId The ID of the campaign.
   * @param metaValues The meta values to set.
   * @param formValues The form values to set.
   */
  public create = async (
    campaignId: string,
    metaValues: MetaValues = {},
    formValues: Record<string, any> = {},
  ): Promise<EnrollmentResponse> => {
    if (!this.jwtEncode) {
      throw new Error(
        'CampaignEnrollmentsEndpoint.create() requires the jwtEncode function to be set.',
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
}
