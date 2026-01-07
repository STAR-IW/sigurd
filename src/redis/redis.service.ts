import { Injectable } from '@nestjs/common';
import Redis, { Redis as RedisType } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private client: RedisType;
  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: 6379,
      //password: this.configService.get<string>('REDIS_PASSWORD'),
    });
  }
  async get<T = any>(key: string): Promise<T | null> {
    const data = await this.client.get(key);
    return data ? JSON.parse(data) : null;
  }
  async set(key: string, value: any, ttlSeconds?: number) {
    const data = JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, data, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, data);
    }
  }
  // async del(key: string) {
  //   await this.client.del(key);
  // }
  async lock(key: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.client.set(key, '1', 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }

  async unlock(key: string): Promise<void> {
    await this.client.del(key);
  }
}
