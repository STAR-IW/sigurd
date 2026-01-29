import { ConflictException } from '@nestjs/common';

export class ClassFullException extends ConflictException {
  constructor(classId: number) {
    super(`Class ${classId} is at full capacity`);
  }
}
