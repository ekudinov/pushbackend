import {Module} from '@nestjs/common';
import {MailerModule} from '@nestjs-modules/mailer';
import {MailService} from './mail.service';
import {ConfigModule, ConfigService} from "@nestjs/config";


@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => ({
                transport: {
                    service: config.get<string>('MAIL_SERVICE'),
                    auth: {
                        user: config.get<string>('MAIL_USER'),
                        pass: config.get<string>('MAIL_PASSWORD')
                    }
                },
                defaults: {
                    from: config.get<string>('MAIL_FROM'),
                },
            }),
            inject: [ConfigService]
        }),
    ],
    controllers: [],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {
}
