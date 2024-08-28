/**
 * Represents a domain name.
 */
export interface Domain {
  /**
   * The ID of the organization.
   */
  organization: string;

  /**
   * The name of the organization.
   */
  name: string;

  /**
   * The domain of the organization.
   */
  domain: string;

  /**
   * Root domain of the domain
   */
  hostname: string;

  /**
   * The URL to the homepage redirect.
   */
  homepageRedirectUrl: string;

  /**
   * Value for CNAME Record Validation => GUID.domain.com.
   */
  cNameVerification: string;

  /**
   * The CNAME Record Name
   */
  cNameDomain: string;

  /**
   * Processing Status
   */
  isProcessing: boolean;

  /**
   * Validation Status
   */
  status: 'valid' | 'invalid' | 'pending' | 'still_pending';

  /**
   * Is Active Domain
   */
  isActive: boolean;

  /**
   * Is Active Domain
   */
  isDeleted: boolean;

  /**
   * Validation Date
   */
  validationDate?: Date;

  /**
   * First time domain validity was checked
   */
  firstChecked?: Date;
}
