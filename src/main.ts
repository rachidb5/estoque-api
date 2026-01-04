import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS pro front no Docker/Local
  app.enableCors({
    origin: [
      'http://localhost:8080', // front no nginx (docker)
      'http://localhost:5173', // front rodando com vite local
      'https://stock-control-mauve.vercel.app/',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Estoque API')
    .setDescription('Documentação da API de Estoque')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
