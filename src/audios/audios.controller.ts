import {Controller, UploadedFile, UseGuards} from '@nestjs/common';
import {Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {AudioEntity} from './audio.entity';
import {AudiosService} from './audios.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {extname} from 'path';
import {diskStorage} from 'multer';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {Roles} from '../auth/roles/roles.decorator';
import {RolesType} from '../auth/roles/roles.type';

const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

const AUDIOS_STORE_DIR = 'uploads/audios';


@Crud({
    model: {
        type: AudioEntity,
    },
    routes: {
        createOneBase: {
            interceptors: [
                FileInterceptor('file', {
                    storage: diskStorage({
                        destination: AUDIOS_STORE_DIR,
                        filename: (req, file, cb) => {
                            const randomName = Array(32)
                                .fill(null)
                                .map(() => Math.round(Math.random() * 16).toString(16))
                                .join('');
                            return cb(null, `${randomName}${extname(file.originalname)}`);
                        },
                    }),
                }),
            ],
        },
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

@ApiTags('audios')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('/api/audios')
export class AudiosController implements CrudController<AudioEntity> {
    constructor(public service: AudiosService) {
    }

    get base(): CrudController<AudioEntity> {
        return this;
    }

    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                },
                title: {
                    type: 'string'
                },
                duration: {
                    type: 'number'
                }
            },
        },
    })
    @Override()
    createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() data: AudioEntity, @UploadedFile() file) {
        data.size = file.size;
        data.fullPath = file.path;
        data.mimeType = file.mimetype;
        data.originalName = file.originalname;
        data.name = file.filename;
        return this.base.createOneBase(req, data);
    }

    @Override()
    deleteOne(@ParsedRequest() req: CrudRequest) {
        this.service.getOne(req).then(item => unlinkAsync(item.fullPath)).catch(err => console.log(err));
        return this.base.deleteOneBase(req);
    }
}
