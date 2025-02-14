import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const enableCors = configService.get<boolean>('ENABLE_CORS');
  const port = configService.get<number>('DATABASE_PORT');

  if (enableCors) {
    app.enableCors();
  }

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, 
      forbidNonWhitelisted: true, 
      transformOptions: {
        enableImplicitConversion: true, 
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'refresh-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document); 

  await app.listen(port || 3000);
}
bootstrap();
