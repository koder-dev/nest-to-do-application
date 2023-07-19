import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcryptjs';
import { Task } from '../../tasks/entities/task.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column('varchar', { length: 256, unique: true, nullable: false })
  username: string;

  @Column('varchar', { length: 256, unique: true, nullable: false })
  email: string;

  @Column('varchar', { length: 256, nullable: false })
  password: string;

  @Column({ nullable: true })
  salt: string;

  @OneToMany((type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];

  async validatePassword(password: string): Promise<boolean> {
    const hashedPassword = await hash(password, this.salt);
    return this.password === hashedPassword;
  }
}
