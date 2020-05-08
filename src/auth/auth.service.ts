import {
    ForbiddenException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
    UnprocessableEntityException
} from '@nestjs/common';
import {UsersService} from '../users/users.service';
import {JwtService} from '@nestjs/jwt';
import {UserEntity} from '../users/user.entity.ts';
import {MailService} from '../mail/mail.service';
import {WINSTON_MODULE_PROVIDER} from 'nest-winston';
import {Logger} from 'winston';
import {LoginDto} from './login.dto';
import {RegisterDto} from './register.dto';
import {RecoverDto} from './recover.dto';
import {randomStringGenerator} from '@nestjs/common/utils/random-string-generator.util';
import {PasswordUpdateDto} from './password-update.dto';
import {JwtPayload} from './jwt-payload';

@Injectable()
export class AuthService {
    constructor(private userService: UsersService,
                private jwtService: JwtService,
                private mailService: MailService,
                @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {
    }

    private static validate(userInDb: UserEntity): UserEntity {
        if (!userInDb) {
            throw new NotFoundException('User not found!');
        }
        if (!userInDb.isConfirm) {
            throw new UnauthorizedException('You must confirm registration to entry!');
        }
        if (!userInDb.isActive) {
            throw new UnauthorizedException('You profile is not active!');
        }
        return userInDb;
    }

    public async login(userDto: LoginDto): Promise<any | { status: number }> {
        return this.userService.findByEmail(userDto.email)
            .then(userIdDb => AuthService.validate(userIdDb))
            .then(user => {
                if (user.isPassValid(userDto.password)) {
                    user.lastActivity = new Date();
                    return user;
                }
                throw new ForbiddenException('User auth are not allowed!');
            })
            .then(user => this.userService.saveUser(user))
            .then((userData) => {
                const payload = { id: userData.id , role: userData.role } as JwtPayload;
                return {
                    access_token: this.jwtService.sign(payload),
                };

            });
    }

    public async register(user: RegisterDto): Promise<any> {
        return this.userService.create(user)
            .then(user => this.mailService.sendRegistrationConfirmLink(user))
            .catch(err => {
                if (err.code === 'ER_DUP_ENTRY') {
                    throw new UnprocessableEntityException('Email already exists!');
                }
                throw new InternalServerErrorException('Something is wrong');
            });
    }

    async confirmRegistration(confirmToken: string): Promise<UserEntity> {
        return this.userService.findByToken(confirmToken).then(user => {
            if (!user) {
                throw new NotFoundException(`Token ${confirmToken} not found`);
            }
            user.token = null;
            user.isConfirm = true;
            user.expired = null;
            return user;
        }).then(user => this.userService.saveUser(user).then(user => user));
    }

    async requestRecoverPassword(recoverDto: RecoverDto): Promise<string> {
        return this.userService.findByEmail(recoverDto.email)
            .then(userInDb => AuthService.validate(userInDb))
            .then(user => {
                user.token = randomStringGenerator();
                return user;
            }).then(user => this.userService.saveUser(user))
            .then(user => user.token);
    }

    async updatePassword(updatePassDto: PasswordUpdateDto): Promise<boolean> {
        return this.userService.findByToken(updatePassDto.token)
            .then(user => {
                user.setPassHash(updatePassDto.password);
                user.token = null;
                return user;
            })
            .then((user => this.userService.saveUser(user)))
            .then((() => true))
            .catch(err => {
                this.logger.error(err);
                return false;
            })
    }

}
