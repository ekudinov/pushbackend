import {MinLength} from 'class-validator';
import {RecoverDto} from './recover.dto';
import {ApiProperty} from '@nestjs/swagger';

export class LoginDto extends RecoverDto {

    @ApiProperty()
    @MinLength(6)
    password: string;
}
