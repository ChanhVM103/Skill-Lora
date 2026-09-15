import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Skillora API')
    .setDescription('API for Skillora career readiness and skill gap coaching MVP.')
    .setVersion('0.1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`😎 Server is running on: http://localhost:${port}`);
  console.log(`🤷 Swagger documentation at: http://localhost:${port}/docs`);
}
await bootstrap();
