import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, 
    forbidNonWhitelisted: true, 
    transform: true,
  }));

  app.enableCors({ 
    origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:5173' 
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Server running on: http://localhost:${port}`);
}
bootstrap();