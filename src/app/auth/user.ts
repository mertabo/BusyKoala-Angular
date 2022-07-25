export interface User {
  id: string;
  fullName: string;
  password: string;
  workspaces: string[];
}

export interface LoginResponse {
  statusCode: number;
  user: User;
}
