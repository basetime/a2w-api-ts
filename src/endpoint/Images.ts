import { Requester } from '../http/Requester';
import { Image } from '../types/Image';
import Endpoint from './Endpoint';

/**
 * Communicate with the images endpoints.
 */
export default class ImagesEndpoint extends Endpoint {
  /**
   * Constructor.
   *
   * @param req The object to use to make requests.
   */
  constructor(req: Requester) {
    super(req, '/images');
  }

  /**
   * Returns the image with the given ID.
   *
   * @param id The ID of the image.
   */
  public getById = async (id: string): Promise<Image | null> => {
    return await this.do.get(`/${id}`);
  };

  /**
   * Returns the images with the given IDs.
   *
   * @param ids The IDs of the images.
   */
  public getByIds = async (ids: string[]): Promise<Image[]> => {
    const url = this.qb.create('/ids').addQuery('ids', ids.join(','));
    return await this.do.get(url);
  };
}
