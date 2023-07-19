import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private readonly entityManager: EntityManager,
  ) {}
  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) query.andWhere('task.status = :status', { status });
    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id, userId: user.id });
    if (!found) {
      throw new NotFoundException(`Task with id:${id} not found`);
    }
    return found;
  }

  async createTask(TaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, description } = TaskDto;
    const newTask = new Task();
    newTask.title = title;
    newTask.description = description;
    newTask.user = user;
    await this.entityManager.save(newTask);

    delete newTask.user;
    return newTask;
  }
  //
  async deleteTaskById(id: number, user: User): Promise<void> {
    const deleteResult = await this.tasksRepository.delete({
      id,
      userId: user.id,
    });

    if (deleteResult.affected === 0)
      throw new NotFoundException(`Task with id - "${id}" not found!`);
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.entityManager.save(task);
    return task;
  }
}
