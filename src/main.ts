import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true, rawBody: true });
  await app.listen(process.env.PORT);
}
bootstrap();
