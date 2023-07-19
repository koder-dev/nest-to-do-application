import { BadRequestException, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatus = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];

  transform(value: any): any {
    value = value.toUpperCase();
    if (!this.isValidStatus(value)) {
      throw new BadRequestException(`"${value}" is invalid status!`);
    }
    return value;
  }

  isValidStatus(status: any): boolean {
    return this.allowedStatus.indexOf(status) !== -1;
  }
}
