import { getBaseUrl } from '../constants';
import { Requester } from '../http/Requester';
import { BarcodeRenderInput } from '../types/Barcode';

/**
 * Strips the `/api/v1` suffix from the configured API base URL so this endpoint can target
 * routes mounted at the site root (e.g. `/barcodes`, `/widgets`).
 *
 * If the base URL does not end with `/api/v1` it is returned unchanged.
 */
const getSiteBaseUrl = (): string => getBaseUrl().replace(/\/api\/v1\/?$/, '');

/**
 * Communicate with the `/barcodes` endpoint.
 *
 * Accessed via `client.barcodes`. The barcode route lives outside `/api/v1`, so this
 * endpoint bypasses the API prefix and targets the site root.
 */
export default class BarcodesEndpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(private req: Requester) { }

  /**
   * Renders a barcode and returns the PNG body as a string.
   *
   * The body is returned via `Response.text()` to match the SDK's existing pkpass
   * download convention. Consumers that need the binary buffer should call the URL
   * directly via `client.http.fetch(...)` with a custom `Accept` header.
   *
   * @param input The barcode render input.
   */
  public render = async (input: BarcodeRenderInput): Promise<string> => {
    const params = new URLSearchParams();
    params.set('type', input.type);
    params.set('data', input.data);
    if (input.width !== undefined) {
      params.set('width', String(input.width));
    }
    if (input.height !== undefined) {
      params.set('height', String(input.height));
    }
    if (input.color !== undefined) {
      params.set('color', input.color);
    }
    if (input.background !== undefined) {
      params.set('background', input.background);
    }

    const url = `${getSiteBaseUrl()}/barcodes?${params.toString()}`;

    return await this.req.fetch<string>(
      url,
      {
        method: 'GET',
        headers: { Accept: 'image/png' },
      },
      false,
    );
  };
}
