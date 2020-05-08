import * as dot from 'dotenv';
import * as fs from 'fs';
import {SubscriptionEntity} from './src/subscriptions/subscription.entity';
import {PushresultEntity} from './src/pushresults/pushresult.entity';
import {NotificationEntity} from './src/notifications/notification.entity';
import {ImageEntity} from './src/images/image.entity';
import {AudioEntity} from './src/audios/audio.entity';
import {UserEntity} from './src/users/user.entity.ts';

const environment = process.env.NODE_ENV || 'dev';
const data: any = dot.parse(fs.readFileSync(`.env.${environment}`));

const conf = {
    'type': 'mysql',
    'host': data.DB_HOST,
    'port': data.DB_PORT,
    'username': 'root',
    'password': data.MYSQL_ROOT_PASSWORD,
    'database': data.MYSQL_DATABASE,
    'synchronize': true,
    'dropSchema': false,
    'logging': true,
    'entities': [
        SubscriptionEntity,
        PushresultEntity,
        NotificationEntity,
        ImageEntity,
        AudioEntity,
        UserEntity
    ],
    'migrations': ['migrations/**/*.ts'],
    'cli': {
        'entitiesDir': 'src',
        'migrationsDir': 'migrations'
    }
};

export = conf;
