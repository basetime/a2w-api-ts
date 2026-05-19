import { z } from 'zod';
import { AttributesSchema } from './Attributes';

/**
 * Schema for a scanner app.
 */
export const ScannerAppSchema = z
  .object({
    /**
     * The ID of the scanner app.
     */
    id: z.string(),

    /**
     * The name of the scanner app.
     */
    name: z.string(),

    /**
     * Description of the app.
     */
    description: z.string(),

    /**
     * The registration code.
     */
    registrationCode: z.string(),

    /**
     * The ID of the organization or '0' for a global template.
     */
    organizationId: z.string(),

    /**
     * The ID of the global template when applicable, or else '0'.
     */
    parentId: z.string(),

    /**
     * The tags associated with the scanner app.
     */
    tags: z.array(z.string()),

    /**
     * The ID of the attributes or the entity.
     */
    attributes: AttributesSchema,

    /**
     * The URL of the webview shown when a pass is scanned.
     */
    webviewScanUrl: z.string(),

    /**
     * The URL of the webview shown when the scanner is in standby mode.
     */
    webviewStandbyUrl: z.string(),

    /**
     * The URL of the webview shown when an error occurs.
     */
    webviewErrorUrl: z.string(),

    /**
     * The password for the webview.
     */
    webviewPassword: z.string(),

    /**
     * The passcode to enter the scanner settings screen.
     */
    passCode: z.string().optional(),

    /**
     * The brand color to use on the scanner screen.
     */
    brandColor: z.string().optional(),

    /**
     * The URL for the brand logo to use on the scanner screen.
     */
    brandLogoUrl: z.string().optional(),

    /**
     * Is the scanner in kiosk mode?
     */
    isKioskMode: z.boolean().optional(),

    /**
     * Is the scanner configured via JSON?
     */
    isJsonConfigured: z.boolean().optional(),

    /**
     * The JSON configuration for the scanner.
     */
    jsonConfig: z.string().optional(),

    /**
     * The URL of the JSON configuration for the scanner.
     */
    jsonConfigUrl: z.string().optional(),

    /**
     * The number of scanners that have been registered.
     */
    scannerCount: z.number(),

    /**
     * Additional scanner app settings.
     */
    settings: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough();

/**
 * Represents a scanner app.
 */
export type ScannerApp = z.infer<typeof ScannerAppSchema>;

type ScannerAppServerManagedField =
  | 'id'
  | 'organizationId'
  | 'parentId'
  | 'registrationCode'
  | 'scannerCount'
  | 'createdDate';

type ScannerAppSettableFields = Omit<ScannerApp, ScannerAppServerManagedField>;

type ScannerAppJsonConfigurationField = 'isJsonConfigured' | 'jsonConfig' | 'jsonConfigUrl';

type ScannerAppStandardField = Exclude<
  keyof ScannerAppSettableFields,
  ScannerAppJsonConfigurationField
>;

type ScannerAppJsonConfiguredInput = Pick<
  ScannerAppSettableFields,
  'jsonConfig' | 'jsonConfigUrl'
> & {
  isJsonConfigured: true;
} & {
  [Field in ScannerAppStandardField]?: never;
};

type ScannerAppStandardInput = Omit<
  ScannerAppSettableFields,
  ScannerAppJsonConfigurationField
> & {
  isJsonConfigured?: false;
  jsonConfig?: never;
  jsonConfigUrl?: never;
};

/**
 * Body accepted by `client.scanners.createApp(...)` / `updateApp(...)`.
 */
export type ScannerAppInput = ScannerAppJsonConfiguredInput | ScannerAppStandardInput;
