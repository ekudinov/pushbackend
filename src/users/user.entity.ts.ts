import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, BeforeInsert} from 'typeorm';
import {ImageEntity} from '../images/image.entity';
import {Exclude} from 'class-transformer';
import {ApiHideProperty, ApiProperty} from '@nestjs/swagger';
import * as crypto from 'crypto';
import {RolesType} from '../auth/roles/roles.type';

@Entity({name: 'users'})
export class UserEntity {

    @PrimaryGeneratedColumn()
    @ApiProperty({readOnly: true})
    id: number;

    @Column({default: 'noname'})
    name: string;

    @Column({unique: true})
    email: string;

    @Column({default: false})
    isConfirm: boolean;

    @Column({default: false})
    isActive: boolean;

    @Column({default: RolesType.NO_ROLE})
    role: RolesType;

    @Column({nullable: true})
    token?: string;

    @Column({nullable: true})
    expired?: Date;

    @Column({nullable: false, default: () => 'now()'})
    created: Date;

    @Column({nullable: true})
    lastActivity?: Date;

    @Exclude({toPlainOnly: true})
    @ApiProperty({
        writeOnly: true,
        required: false,
        description: 'Use only to create new password'
    })
    password: string;

    @Column()
    @Exclude()
    @ApiHideProperty()
    passHash: string;

    @OneToOne(type => ImageEntity)
    @JoinColumn()
    avatar?: ImageEntity;

    setPassHash(password: string) {
        this.passHash = this.genPassHash(password);
    }

    genPassHash(password: string): string {
        return crypto.createHmac('sha256', password).digest('hex');
    }

    isPassValid(password: string): boolean {
        return this.passHash === this.genPassHash(password);
    }

}
