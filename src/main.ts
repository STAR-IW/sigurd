import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //security-related HTTP headers
  app.use(helmet());

  // CORS - allow frontend access
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });
  app.enableShutdownHooks();
  //Ensures that all incoming data is validated against the DTOs.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that aren't in dto
      forbidNonWhitelisted: true, // Throw error if extra properties sent
      transform: true, // Automatically transform payloads to DTO instances
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  //swagger Api doc
  const config = new DocumentBuilder()
    .setTitle('Booking real-time app API')
    .setDescription('Class Booking System with Real-time Availability')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
