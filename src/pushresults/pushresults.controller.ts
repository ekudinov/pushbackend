import {Controller, UseGuards} from '@nestjs/common';
import {PushresultEntity} from './pushresult.entity';
import {PushresultsService} from './pushresults.service';
import {Crud, CrudController} from '@nestjsx/crud';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {Roles} from '../auth/roles/roles.decorator';
import {RolesType} from '../auth/roles/roles.type';

@Crud({
    model: {
        type: PushresultEntity
    },
    query: {
        join: {
            subscription: {
                eager: true
            },
            notification: {
                eager: true
            },
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

@ApiTags('push results')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/push-results')
export class PushresultsController implements CrudController<PushresultEntity>{
    constructor(public service: PushresultsService) {
    }
}
