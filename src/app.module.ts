import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {WinstonModule} from 'nest-winston';
import * as winston from 'winston';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PushresultsModule} from './pushresults/pushresults.module';
import {NotificationsModule} from './notifications/notifications.module';
import {SubscriptionsModule} from './subscriptions/subscriptions.module';
import {SubscriptionEntity} from './subscriptions/subscription.entity';
import {NotificationEntity} from './notifications/notification.entity';
import {PushresultEntity} from './pushresults/pushresult.entity';
import {ImagesModule} from './images/images.module';
import {AudiosModule} from './audios/audios.module';
import {AudioEntity} from './audios/audio.entity';
import {ImageEntity} from './images/image.entity';
import {AuthModule} from './auth/auth.module';
import {UserEntity} from './users/user.entity.ts';
import {MailModule} from './mail/mail.module';
import {UsersModule} from './users/users.module';
import {RolesGuard} from './auth/roles/roles.guard';
import {APP_GUARD} from '@nestjs/core';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: config.get<string>('DB_HOST'),
                port: parseInt(config.get<string>('DB_PORT')),
                username: 'root',
                password: config.get<string>('MYSQL_ROOT_PASSWORD'),
                database: config.get<string>('MYSQL_DATABASE'),
                entities: [
                    SubscriptionEntity,
                    NotificationEntity,
                    PushresultEntity,
                    AudioEntity,
                    ImageEntity,
                    UserEntity
                ],
                synchronize: true,
            }),
            inject: [ConfigService]
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`
        }),
        WinstonModule.forRoot({
                level: 'debug',
                transports: [
                    new winston.transports.Console({
                        format: winston.format.combine(
                            winston.format.splat(),
                            winston.format.json(),
                            winston.format.prettyPrint()
                        )
                    })
                ]
            }
        ),
        PushresultsModule,
        NotificationsModule,
        SubscriptionsModule,
        ImagesModule,
        AudiosModule,
        AuthModule,
        MailModule,
        UsersModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {
}
