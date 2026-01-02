import { Role } from '@prisma/client';

export interface JwtPayload {
  createdAt: Date;
  id: number;
  email: string;
  name: string;
  role: Role;
  phone: string;
}
