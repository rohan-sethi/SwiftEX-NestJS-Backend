import Redis from 'ioredis';
export declare class RedisService {
    private readonly client;
    constructor();
    getClient(): Redis;
}
