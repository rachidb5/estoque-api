import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS pro front no Docker/Local
  app.enableCors({
    origin: true, // libera todas as origens
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
