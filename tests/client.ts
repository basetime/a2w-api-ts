import { expect } from 'chai';
import { Client } from '../src/index';

describe('Client', () => {
  it('should create a new instance', () => {
    const client = new Client('api_key', 'api_secret');
    expect(client).to.be.an.instanceOf(Client);
  });
});
