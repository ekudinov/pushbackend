import {Inject, Injectable} from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";
import {UserEntity} from "../users/user.entity.ts";
import {Logger} from "winston";
import {WINSTON_MODULE_PROVIDER} from "nest-winston";

@Injectable()
export class MailService {

    readonly confirmUrl = 'http://localhost:3000/auth/confirm';

    constructor(private readonly mailerService: MailerService,
                @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    }

    async sendRegistrationConfirmLink(user: UserEntity) {
        this.mailerService
            .sendMail({
                to: user.email,
                subject: 'Testing registration confirm link via email',
                html: `<h1>Hello ${user.name}!</h1>
                       <div>
                            For confirm registration go to link 
                            <a href="${this.confirmUrl}/${user.token}">Link to confirm</a>
                       </div>
                       <div>PS: If the email is not verified after ${user.expired}, 
                       account will be deleted</div>`
            }).then(res => this.logger.debug(res)).catch(err => this.logger.error(err));
    }

}
