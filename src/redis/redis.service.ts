import { Injectable } from '@nestjs/common';
import Redis, { Redis as RedisType } from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private client: RedisType; // publish, locks, GET/SET
  private redisSubscriber: RedisType; // subscribe
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

    this.client.on('connect', () => console.log('REDIS | Client connected'));
    this.redisSubscriber.on('ready', () => {
      console.log('REDIS | Subscriber ready');
      this.subscribersListener(); // set up the subscribers' listener;

      this.redisSubscriber.subscribe('class:updates', (err, count) => {
        if (err) {
          console.error('REDIS | Subscribe error:', err);
        } else {
          console.log(`REDIS | Subscribed to class:updates. Count: ${count}`);
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
    console.log(`Redis| published to ${channel}:`, message);
  }

  private subscribersListener() {
    console.log('REDIS | subscribersListener() started');

    this.redisSubscriber.on('message', (channel, message) => {
      console.log(`Received ${message} from ${channel}`);
      const parsed: any = JSON.parse(message);
      if (this.channelToCallbackFunc.has(channel)) {
        this.channelToCallbackFunc
          .get(channel)
          ?.forEach((callback) => callback(parsed));
      }
    });
  }
  //channel name to array of callback functions
  private channelToCallbackFunc = new Map<string, Function[]>();

  // Register callbacks
  public onMessage(channel: string, callback: Function) {
    const existing = this.channelToCallbackFunc.get(channel);
    if (existing) {
      existing.push(callback);
    } else {
      this.channelToCallbackFunc.set(channel, [callback]);
    }
  }

}
