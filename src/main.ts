import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {SubscriptionsModule} from './subscriptions/subscriptions.module';
import {PushresultsModule} from './pushresults/pushresults.module';
import {NotificationsModule} from './notifications/notifications.module';
import {ImagesModule} from './images/images.module';
import {AudiosModule} from './audios/audios.module';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';
import {RolesGuard} from './auth/roles/roles.guard';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {cors: true});

    const options = new DocumentBuilder()
        .setTitle('Push Admin api')
        .setDescription('The push API for backend part of Push Admin app')
        .setVersion('0.1')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options, {
        include: [
            SubscriptionsModule,
            PushresultsModule,
            NotificationsModule,
            ImagesModule,
            AudiosModule,
            UsersModule,
            AuthModule
        ]
    });
    SwaggerModule.setup('api/docs', app, document);

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);
}

bootstrap();
