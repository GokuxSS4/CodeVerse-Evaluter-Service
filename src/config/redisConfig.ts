import Redis from 'ioredis';
import serverConfig from './serverConfig';

const redisConfig = {
  port: serverConfig.REDIS_PORT as number,
  host: serverConfig.REDIS_HOST,
  maxRetriesPerRequest: null
};

export default new Redis(redisConfig);
