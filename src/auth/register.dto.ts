import {MinLength} from 'class-validator';
import {LoginDto} from './login.dto';
import {ApiProperty} from '@nestjs/swagger';

export class RegisterDto extends LoginDto {

    @ApiProperty()
    @MinLength(3)
    name: string;

}
