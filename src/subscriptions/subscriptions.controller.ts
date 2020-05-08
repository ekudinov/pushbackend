import {Controller, UseGuards} from '@nestjs/common';
import {Crud, CrudController} from '@nestjsx/crud';
import {SubscriptionEntity} from './subscription.entity';
import {SubscriptionsService} from './subscriptions.service';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {Roles} from '../auth/roles/roles.decorator';
import {RolesType} from '../auth/roles/roles.type';

@Crud({
    model: {
        type: SubscriptionEntity
    },
    query: {
        join: {
            results: {
                eager: true
            },
            notifications: {
                eager: true
            }
        }
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

@ApiTags('subscriptions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/subscriptions')
export class SubscriptionsController implements CrudController<SubscriptionEntity>{
    constructor(public service: SubscriptionsService) {
    }
}
