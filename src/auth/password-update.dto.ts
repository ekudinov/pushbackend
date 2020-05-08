import {IsNotEmpty, MinLength} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class PasswordUpdateDto {

    @ApiProperty()
    @MinLength(6)
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    token: string;
}
