import { Entity, Column, ManyToOne, OneToMany, Index } from 'typeorm';
import { ExtendedEntity } from '../shared';
import { UserEntity } from 'src/user/user.entity';
import { PostEntity } from 'src/post/post.entity';

export type SubnodditStatus = 'ACTIVE' | 'NOT_ACTIVE';

@Entity({ name: 'subnoddits' })
@Index(['status', 'userId'])
@Index(['status', 'userId', 'name'])
export class SubnodditEntity extends ExtendedEntity {
  @Column({
    type: 'varchar',
    length: 255,
    unique: true,
  })
  @Index()
  name!: string;

  @Column({
    type: 'varchar',
    length: 700,
    nullable: true,
    default: 'pictures/blank-subnoddit-picture-S4P3RS3CR3T',
  })
  image!: string;

  @Column({
    type: 'varchar',
    length: 700,
    nullable: true,
  })
  about!: string;

  @Column({
    type: 'enum',
    enum: ['ACTIVE', 'NOT_ACTIVE'],
    default: 'ACTIVE',
    select: false,
  })
  @Index()
  status!: SubnodditStatus;

  @ManyToOne(
    () => UserEntity,
    user => user.subnoddits,
  )
  user!: UserEntity;

  @OneToMany(
    () => PostEntity,
    post => post.subnoddit,
  )
  posts!: PostEntity[];
}
