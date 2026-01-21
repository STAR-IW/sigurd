import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis, { Redis as RedisType } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: RedisType; // publish, locks, GET/SET
  private redisSubscriber: RedisType; // subscribe
  private readonly logger = new Logger(RedisService.name);
  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: 6379,
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });
    this.redisSubscriber = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: 6379,
      password: this.configService.get<string>('REDIS_PASSWORD'),
    });

    this.client.on('error', (err) => {
      this.logger.error('Client error:', err);
    });
    this.redisSubscriber.on('error', (err) => {
      this.logger.error('Subscriber error:', err);
    });

    this.client.on('connect', () => {
      this.logger.log('Client connected');
    });

    this.redisSubscriber.on('ready', () => {
      this.logger.log('Subscriber ready');
      this.subscribersListener(); // set up the subscribers' listener;

      this.redisSubscriber.subscribe('class:updates', (err, count) => {
        if (err) {
          this.logger.error('Subscribe error:', err);
        } else {
          console.log(`Subscribed to class:updates. Count: ${count}`);
        }
      });
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

  async lock(key: string, ttlSeconds: number): Promise<boolean> {
    const result = await this.client.set(key, '1', 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }

  async unlock(key: string): Promise<void> {
    await this.client.del(key);
  }

  async publish(channel: string, message: Record<string, any>) {
    await this.client.publish(channel, JSON.stringify(message));
    this.logger.log(`Published to ${channel}`);
  }

  private subscribersListener() {
    console.log('subscribersListener() started');

    this.redisSubscriber.on('message', (channel, message) => {
      this.logger.log(`Received ${message} from ${channel}`);
      const parsed: any = JSON.parse(message);
      if (this.channelToCallbackFunc.has(channel)) {
        this.channelToCallbackFunc
          .get(channel)
          ?.forEach((callback) => callback(parsed));
      }
    });
  }
  //channel name to array of callback functions
  private channelToCallbackFunc = new Map<string, ((data: any) => void)[]>();

  // Register callbacks
  public onMessage(channel: string, callback: (data: any) => void) {
    const existing = this.channelToCallbackFunc.get(channel);
    if (existing) {
      existing.push(callback);
    } else {
      this.channelToCallbackFunc.set(channel, [callback]);
    }
  }

  //gracefully shutDown
  async onModuleDestroy() {
    await this.client.quit();
    await this.redisSubscriber.quit();
    this.logger.log('Redis connections closed');
  }
}
