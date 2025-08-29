import { Attributes } from './Attributes';

/**
 * Represents a scanner app.
 */
export interface ScannerApp {
  /**
   * The ID of the scanner app.
   */
  id: string;

  /**
   * The name of the scanner app.
   */
  name: string;

  /**
   * Description of the app.
   */
  description: string;

  /**
   * The registration code.
   */
  registrationCode: string;

  /**global
   * The ID of the organization or '0' for a global template.
   */
  organizationId: string;

  /**
   * The ID of the global template when applicable, or else '0'.
   */
  parentId: string;

  /**
   * The tags associated with the scanner app.
   */
  tags: string[];

  /**
   * The ID of the attributes or the entity.
   */
  attributes: Attributes;

  /**
   * The URL of the webview shown when a pass is scanned.
   */
  webviewScanUrl: string;

  /**
   * The URL of the webview shown when the scanner is in standby mode.
   */
  webviewStandbyUrl: string;

  /**
   * The passcode to enter the scanner settings screen.
   */
  passCode?: string;

  /**
   * The brand color to use on the scanner screen.
   */
  brandColor?: string;

  /**
   * The URL for the brand logo to use on the scanner screen.
   */
  brandLogoUrl?: string;

  /**
   * Is the scanner in kiosk mode?
   */
  isKioskMode?: boolean;

  /**
   * The number of scanners that have been registered.
   */
  scannerCount: number;
}
