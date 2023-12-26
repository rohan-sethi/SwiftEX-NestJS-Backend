import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor() {
    this.client = new Redis(
      process.env.REDIS_URL,
    );
  }

  getClient(): Redis {
    return this.client;
  }
}
