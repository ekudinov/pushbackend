import {Injectable, CanActivate, ExecutionContext} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {JwtService} from '@nestjs/jwt';
import {ExtractJwt} from 'passport-jwt';
import {JwtPayload} from '../jwt-payload';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) {
    }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<number[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = ExtractJwt.fromAuthHeaderAsBearerToken();
        const data = this.jwtService.decode(token(request)) as JwtPayload;
        return !!roles.find(role => role === data.role);
    }
}
