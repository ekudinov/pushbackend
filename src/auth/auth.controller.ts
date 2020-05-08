import {Body, Controller, Get, HttpStatus, Param, Post, Query} from '@nestjs/common';
import {AuthService} from './auth.service';
import { Redirect } from '@nestjsplus/redirect';
import {validate} from "class-validator";
import {LoginDto} from './login.dto';
import {RegisterDto} from './register.dto';
import {RecoverDto} from './recover.dto';
import {PasswordUpdateDto} from './password-update.dto';
import {
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiNotFoundResponse, ApiOperation, ApiParam,
    ApiResponse, ApiTags,
    ApiUnauthorizedResponse,
    ApiUnprocessableEntityResponse
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private  readonly  authService:  AuthService) {
    }

    @ApiOperation({ description: "Login to admin panel" })
    @ApiNotFoundResponse({ description: 'Account not found.'})
    @ApiForbiddenResponse({ description: 'Forbidden to entry.'})
    @ApiUnauthorizedResponse({ description: 'Auth verification error.'})
    @Post('login')
    async login(@Body() user: LoginDto): Promise<any> {
        return this.authService.login(user);
    }

    @ApiOperation({ description: "Registration for new user. After you must confirm registration via email" })
    @ApiCreatedResponse({ description: 'The user has been successfully created.'})
    @ApiUnprocessableEntityResponse( { description: 'Email already exists'})
    @Post('register')
    async register(@Body() user: RegisterDto): Promise<any> {
        await validate(user, {
            groups: ['registration']
        });
        return this.authService.register(user);
    }

    @ApiOperation({ description: "Confirm registration. Confirm link is mailed to email" })
    @ApiNotFoundResponse({ description: 'Token not found.'})
    @ApiResponse({ status: HttpStatus.FOUND, description: 'Redirect to login.'})
    @ApiParam({name: 'redirect', type: 'string', description: 'Redirect url to login'})
    @Redirect()
    @Get('confirm/:token')
    async confirmRegistration(@Param('token') token: string,
                              @Query('redirect') redirect = '/') {
        await this.authService.confirmRegistration(token);
        return { statusCode: HttpStatus.FOUND, url: redirect};
    }

    @ApiOperation({ description: "Recover password request" })
    @ApiUnauthorizedResponse({ description: 'User found but not can be auth.'})
    @ApiNotFoundResponse({ description: 'Account not found.'})
    @ApiResponse({ status: 201, description: 'Return {token: "string token" }.'})
    @Post('pass/recover')
    async recoverPassword(@Body() recover: RecoverDto): Promise<{token: string}> {
        return { token: await this.authService.requestRecoverPassword(recover)};
    }

    @ApiOperation({ description: "Update password after recover password request" })
    @ApiResponse({ status: 201, description: 'Return {result: "boolean result"}.'})
    @Post('pass/update')
   async updatePassword(@Body() passDto: PasswordUpdateDto): Promise<{result: boolean}> {
        return { result: await this.authService.updatePassword(passDto) };
    }

}
