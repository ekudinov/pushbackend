import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {SubscriptionEntity} from '../subscriptions/subscription.entity';
import {ApiProperty} from '@nestjs/swagger';
import {PushresultEntity} from '../pushresults/pushresult.entity';

@Entity({
    name: 'notifications',
})
export class NotificationEntity {

    @PrimaryGeneratedColumn()
    @ApiProperty({readOnly: true})
    id: number;

    @Column({ nullable: false })
    title: string;

    @Column({ nullable: false })
    message: string;

    @ApiProperty({
        type: Date,
        readOnly: true
    })
    @Column({ nullable: false, default: () => 'now()' })
    created: Date;

    @Column({ nullable: false })
    sendDate: Date;

    @ApiProperty({type: () => SubscriptionEntity, isArray: true})
    @ManyToMany(
        type => SubscriptionEntity,
        subscription => subscription.notifications
    )
    @JoinTable({
        name: 'notifications_subscriptions',
        joinColumn: {name: 'subscription_id', referencedColumnName: 'id'},
        inverseJoinColumn: {name: 'notification_id', referencedColumnName: 'id'}
    })
    subscriptions: SubscriptionEntity[];

    @ApiProperty({type: () => PushresultEntity, isArray: true})
    @OneToMany(
        type => PushresultEntity,
        result => result.notification
    )
    results: PushresultEntity[];
}
