import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseUtils } from './utils/response.util';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  const enableAPIDocs = await configService.get<boolean>('ENABLE_API_DOCS');

  if (enableAPIDocs) {
    const options = new DocumentBuilder()
      .setTitle('IMPT API')
      .setDescription('API for IMPT')
      .setVersion('1.0')
      .addTag('impt')
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
  }

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: false,
      exceptionFactory: (errors) => {
        const messages = errors.flatMap((error) =>
          ResponseUtils.handleClassValidatorResponse(error),
        );

        return new BadRequestException(
          ResponseUtils.buildCustomResponse(1, {}, messages),
        );
      },
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();
  const port = configService.get<number>('PORT');
  await app.listen(port ? port : 3000);
}
bootstrap();
