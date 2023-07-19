import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/entities/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger();
  constructor(private tasksService: TasksService) {}
  @Get()
  getTasks(
    @GetUser() user: User,
    @Query(ValidationPipe) filterDto: GetTaskFilterDto,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" retrieving task with id: "${id}"`,
    );
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() TaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(
        TaskDto,
      )}`,
    );
    return this.tasksService.createTask(TaskDto, user);
  }

  @Delete('/:id')
  deleteTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    this.logger.verbose(
      `User "${user.username}" deleting the task with id: "${id}"`,
    );
    return this.tasksService.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    this.logger.verbose(
      `User "${user.username}" updating task with id: "${id}". Update details: }`,
    );
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
