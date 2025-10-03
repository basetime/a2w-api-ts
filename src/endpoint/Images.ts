import { Image } from '../types/Image';
import Endpoint from './Endpoint';

/**
 * The organizations endpoint.
 */
const endpoint = '/images';

/**
 * Communicate with the images endpoints.
 */
export default class ImagesEndpoint extends Endpoint {
  /**
   * Returns the image with the given ID.
   *
   * @param id The ID of the image.
   */
  public getById = async (id: string): Promise<Image | null> => {
    return await this.doGet<Image | null>(`${endpoint}/${id}`);
  };

  /**
   * Returns the images with the given IDs.
   *
   * @param ids The IDs of the images.
   */
  public getByIds = async (ids: string[]): Promise<Image[]> => {
    return await this.doGet<Image[]>(`${endpoint}/ids?ids=${ids.join(',')}`);
  };
}
