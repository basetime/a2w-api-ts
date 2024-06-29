import { Client } from './index';

const c = new Client('api_key', 'api_secret');
console.log(c.campaigns.getPasses('123'));
