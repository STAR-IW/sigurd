import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    const adapter = new PrismaPg({
      connectionString: config.get('DATABASE_URL') as string,
    });
    super({ adapter });
  }
}
