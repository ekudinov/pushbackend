import {Controller, UseGuards} from '@nestjs/common';
import {Crud, CrudController} from '@nestjsx/crud';
import {NotificationEntity} from './notification.entity';
import {NotificationsService} from './notifications.service';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {Roles} from '../auth/roles/roles.decorator';
import {RolesType} from '../auth/roles/roles.type';

@Crud({
    model: {
       type: NotificationEntity
    },
    query: {
        join: {
            results: {
                eager: true
            },
            subscriptions: {
                eager: true
            },
        },
    },
    routes: {
        deleteOneBase: {
            decorators: [Roles(RolesType.ADMIN)]
        },
        updateOneBase: {
            decorators: [Roles(RolesType.ADMIN)]
        },
        replaceOneBase: {
            decorators: [Roles(RolesType.ADMIN)]
        }
    }
})

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/notifications')
export class NotificationsController implements CrudController<NotificationEntity>{
    constructor(public service: NotificationsService) {
    }
}
