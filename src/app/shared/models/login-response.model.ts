import { User } from './user.model';

export interface LoginResponse {
  statusCode: number;
  user: User;
}
