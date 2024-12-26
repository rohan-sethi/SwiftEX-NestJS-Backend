import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from './api/v1/auth/jwt-auth.guard';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true, rawBody: true });
  app.setGlobalPrefix('api/');
  // app.useGlobalGuards(new JwtAuthGuard());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(process.env.PORT,()=>{
    console.log("app runnin at: http://localhost:3001")
  });
}
bootstrap();
