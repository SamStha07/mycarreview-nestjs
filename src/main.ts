import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { CookieSession } from 'cookie-session'; will leads to types error
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    cookieSession({
      name: 'session',
      keys: ['asdasdsad'],
    }),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      // incoming request will strip out the unexpected/unvalidated fields
      // if we accepting email and password fields only if we send another field like address then address will get exclude from the request
      whitelist: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();

// chapter 15
