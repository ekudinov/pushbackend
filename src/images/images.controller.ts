import {Controller, UploadedFile, UseGuards} from '@nestjs/common';
import {Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest} from '@nestjsx/crud';
import {ImageEntity} from './image.entity';
import {ImagesService} from './images.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {extname} from 'path';
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiTags} from '@nestjs/swagger';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {Roles} from '../auth/roles/roles.decorator';
import {RolesType} from '../auth/roles/roles.type';

const fs = require('fs');
const {promisify} = require('util');
const unlinkAsync = promisify(fs.unlink);

const IMAGES_STORE_DIR = 'uploads/images';

@Crud({
    model: {
        type: ImageEntity,
    },
    routes: {
        createOneBase: {
            interceptors: [
                FileInterceptor('file', {
                    storage: diskStorage({
                        destination: IMAGES_STORE_DIR,
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

@ApiTags('images')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('/api/images')
export class ImagesController implements CrudController<ImageEntity> {
    constructor(public service: ImagesService) {
    }

    get base(): CrudController<ImageEntity> {
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
                }
            },
        },
    })
    @Override()
    createOne(@ParsedRequest() req: CrudRequest, @ParsedBody() data: ImageEntity, @UploadedFile() file) {
        data.name = file.filename;
        data.fullPath = file.path;
        data.size = file.size;
        data.mimeType = file.mimetype;
        data.originalName = file.originalname;
        return this.base.createOneBase(req, data);
    }

    @Override()
    deleteOne(@ParsedRequest() req: CrudRequest) {
        this.service.getOne(req).then(item => unlinkAsync(item.fullPath)).catch(err => console.log(err));
        return this.base.deleteOneBase(req);
    }
}
