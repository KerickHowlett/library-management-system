import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const GLOBAL_PREFIX = 'api' as const;
    app.setGlobalPrefix(GLOBAL_PREFIX);

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );

    const PORT = Number(process.env.PORT || 3000);
    await app.listen(PORT);

    Logger.log(`🚀 Application is running on: http://localhost:${PORT}/${GLOBAL_PREFIX}`);
}

bootstrap();
