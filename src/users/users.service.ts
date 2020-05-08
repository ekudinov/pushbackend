import {Injectable, UnprocessableEntityException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {randomStringGenerator} from '@nestjs/common/utils/random-string-generator.util';
import {UserEntity} from './user.entity.ts';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {RegisterDto} from '../auth/register.dto';
import {RolesType} from '../auth/roles/roles.type';

@Injectable()
export class UsersService extends TypeOrmCrudService<UserEntity> {

    readonly expiredHourPeriod = 1;

    constructor(@InjectRepository(UserEntity) private userRepository: Repository<UserEntity>) {
        super(userRepository);
    }

    async findByEmail(email: string): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where: {
                email: email,
            }
        });
    }

    async create(user: RegisterDto): Promise<UserEntity> {
        const newUser = this.userRepository.create();
        newUser.name = user.name;
        newUser.email = user.email;
        newUser.setPassHash(user.password);
        newUser.token = randomStringGenerator();
        const date = new Date();
        date.setHours(date.getHours() + this.expiredHourPeriod);
        newUser.expired = date;
        newUser.isActive = true;
        newUser.role = RolesType.USER;
        return this.userRepository.save(newUser);
    }

    async findByToken(token: string): Promise<UserEntity> {
        return await this.userRepository.findOne({
            where: {
                token: token
            }
        });
    }

    async saveUser(user: UserEntity): Promise<UserEntity> {
        return await this.userRepository.save(user);
    }

}
