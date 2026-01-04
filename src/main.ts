import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Ensures that all incoming data is validated against the DTOs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that aren't in dto
      forbidNonWhitelisted: true, // Throw error if extra properties sent
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
