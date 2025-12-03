import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import { AdminSeederService } from './seeds/admin-seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
app.enableCors({
  origin: [process.env.FRONTEND_ORIGIN],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});

const seeder = app.get(AdminSeederService);
await seeder.seedAdmin();


  await app.listen(process.env.PORT ?? 8080);
  console.log(`Server running on port ${process.env.PORT ?? 8080}`);
}
bootstrap();
