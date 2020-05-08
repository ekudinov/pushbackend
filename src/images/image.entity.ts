import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';

@Entity({ name: 'images'})
export class ImageEntity {

    @PrimaryGeneratedColumn()
    @ApiProperty({readOnly: true})
    id: number;

    @Column({ nullable: false })
    title: string;

    @ApiProperty({readOnly: true})
    @Column()
    size: number;

    @ApiProperty({readOnly: true})
    @Column()
    mimeType: string;

    @ApiProperty({readOnly: true})
    @Column({nullable: false})
    fullPath: string;

    @ApiProperty({readOnly: true})
    @Column()
    originalName:string;

    @ApiProperty({readOnly: true})
    @Column({nullable: false})
    name: string;

    @ApiProperty({readOnly: true})
    @Column({nullable: false, default: () => 'now()'})
    created: Date;

}
