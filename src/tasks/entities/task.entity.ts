import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TaskStatus } from '../task-status.enum';
import { User } from '../../auth/entities/user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column('varchar', { length: 256 })
  title: string;

  @Column({
    type: 'text',
  })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  @ManyToOne((type) => User, (user) => user.tasks, {
    eager: false,
    cascade: true,
  })
  user: User;

  @Column()
  userId: number;
}
