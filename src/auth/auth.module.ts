import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from '../users/user.entity.ts';
import {UsersService} from '../users/users.service';
import {JwtModule} from '@nestjs/jwt';
import {AuthController} from './auth.controller';
import {MailModule} from "../mail/mail.module";
import {jwtConstants} from './constants';
import {PassportModule} from '@nestjs/passport';
import {JwtStrategy} from './strategies/jwt.strategy';
import {RolesGuard} from './roles/roles.guard';
import {APP_GUARD} from '@nestjs/core';

@Module({
    providers: [AuthService, UsersService, JwtStrategy,
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        }
        ],
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '3600s' },
        }),
        MailModule,
        PassportModule ],
    controllers: [AuthController]
})
export class AuthModule {
}
