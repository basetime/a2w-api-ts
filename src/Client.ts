import Auth from './Auth';
import CampaignsEndpoint from './CampaignsEndpoint';
import ClaimsEndpoint from './CampaignsEndpoint';
import { ILogger } from './ILogger';
import NoopLogger from './NoopLogger';

/**
 * Client class that communicates with the the addtowallet API.
 */
export default class Client {
  /**
   * Base URL for the production environment.
   */
  protected readonly baseProd = 'https://app.addtowallet.io/api/v1';

  /**
   * Base URL for the dev environment.
   */
  protected readonly baseDev = 'https://local.addtowallet.io:5009/api/v1';

  /**
   * The base URL.
   */
  protected baseUrl = process.env.NODE_ENV === 'production' ? this.baseProd : this.baseDev;

  /**
   * The authentication object.
   */
  protected auth: Auth;

  /**
   * The logger.
   */
  protected logger: ILogger;

  /**
   * The campaigns endpoint.
   */
  protected _campaigns?: CampaignsEndpoint;

  /**
   * The claims endpoint.
   */
  protected _claims?: ClaimsEndpoint;

  /**
   * Constructor.
   *
   * @param key The API key.
   * @param secret The API secret.
   * @param logger The logger to use.
   */
  constructor(key: string, secret: string, logger?: ILogger) {
    this.logger = logger || new NoopLogger();
    this.auth = new Auth(key, secret, this.baseUrl, this.logger);
  }

  /**
   * Returns the campaigns endpoint.
   *
   * @returns {CampaignsEndpoint} The campaigns endoint.
   */
  public get campaigns(): CampaignsEndpoint {
    if (!this._campaigns) {
      this._campaigns = new CampaignsEndpoint(this.auth);
    }

    return this._campaigns;
  }

  /**
   * Returns the claims endpoint.
   *
   * @returns {ClaimsEndpoint} The claims endpoint.
   */
  public get claims(): ClaimsEndpoint {
    if (!this._claims) {
      this._claims = new ClaimsEndpoint(this.auth);
    }

    return this._claims;
  }
}
