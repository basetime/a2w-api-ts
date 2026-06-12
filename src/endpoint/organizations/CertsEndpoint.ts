import { z } from 'zod';
import {
  GoogleIssuer,
  GoogleIssuerExport,
  GoogleIssuerExportSchema,
  GoogleIssuerSchema,
} from '../../types/GoogleIssuer';
import {
  PassType,
  PassTypeExport,
  PassTypeExportSchema,
  PassTypeSchema,
} from '../../types/PassType';
import Endpoint from '../Endpoint';

/**
 * Communicate with the `/organization/passTypes*` and `/organization/googleIssuers*`
 * sub-endpoints.
 *
 * Accessed via `client.organizations.certs`. Provides access to Apple pass types and
 * Google Wallet issuers, including export of sensitive credentials.
 */
export default class OrganizationCertsEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param parent The parent `OrganizationsEndpoint` whose `req`, `do`, and `qb` are
   *   reused.
   */
  constructor(parent: Endpoint) {
    super(parent);
  }

  /**
   * Returns the Apple pass types for the authenticated organization.
   *
   * Sensitive fields (signer certificate, key, passphrase) are omitted from the response.
   */
  public getPassTypes = async (): Promise<PassType[]> => {
    return await this.do.get('/passTypes', z.array(PassTypeSchema));
  };

  /**
   * Exports a pass type, including its signer certificate, key, and passphrase.
   *
   * @param id The ID of the pass type.
   */
  public exportPassType = async (id: string): Promise<PassTypeExport> => {
    return await this.do.get(`/passTypes/${id}/export`, PassTypeExportSchema);
  };

  /**
   * Returns the Google Wallet issuers for the authenticated organization.
   *
   * Service-account credentials are omitted from the response.
   */
  public getGoogleIssuers = async (): Promise<GoogleIssuer[]> => {
    return await this.do.get('/googleIssuers', z.array(GoogleIssuerSchema));
  };

  /**
   * Exports a Google issuer, including its service-account credentials.
   *
   * @param id The ID of the Google issuer.
   */
  public exportGoogleIssuer = async (id: string): Promise<GoogleIssuerExport> => {
    return await this.do.get(`/googleIssuers/${id}/export`, GoogleIssuerExportSchema);
  };
}
