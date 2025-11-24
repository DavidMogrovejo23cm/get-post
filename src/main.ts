import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  setupGlobalPipes(app);
  setupSwagger(app);
  
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
}

function setupGlobalPipes(app) {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
}

function setupSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle('SGU API')
    .setDescription('Sistema de Gestión Universitaria API')
    .setVersion('1.0')
    .addTag('careers')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

bootstrap();