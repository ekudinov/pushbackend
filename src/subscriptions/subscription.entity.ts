import {Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {SubscriptionsType} from './subscription-type';
import {ApiProperty} from '@nestjs/swagger';
import {PushresultEntity} from '../pushresults/pushresult.entity';
import {NotificationEntity} from '../notifications/notification.entity';

@Entity({
    name: 'subscriptions'
})
export class SubscriptionEntity {

    @PrimaryGeneratedColumn()
    @ApiProperty({readOnly: true})
    id: number;

    @Column({ nullable: false })
    endpoint: string;

    @Column({ nullable: false })
    p256dh: string;

    @Column({ nullable: false })
    auth: string;

    @ApiProperty({
        description: `${SubscriptionsType.OTHER} - OTHER 
                      ${SubscriptionsType.FCM} - FCM
                      ${SubscriptionsType.FPS} - FSP`,
        enum: [SubscriptionsType.OTHER, SubscriptionsType.FCM, SubscriptionsType.FPS],
        required: true
    })
    @Column({ nullable: false })
    type: SubscriptionsType;

    @Column({ nullable: false, default: () => 'now()' })
    created: Date;

    @ApiProperty({type: () => PushresultEntity, isArray: true})
    @OneToMany(
        type => PushresultEntity,
        result => result.subscription
    )
    results: PushresultEntity[];

    @ApiProperty({type: () => NotificationEntity, isArray: true})
    @ManyToMany(
      type => NotificationEntity,
        notification => notification.subscriptions
    )
    notifications: NotificationEntity[]
}


