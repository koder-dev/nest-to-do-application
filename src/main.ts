import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as process from 'process';

async function bootstrap() {
  const PORT: number = Number(process.env.PORT) || 4000;
  const app = await NestFactory.create(AppModule);
  await app.listen(PORT);
  Logger.log(`Application started at port: ${PORT}`);
}
bootstrap();
