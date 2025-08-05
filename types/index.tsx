export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
}
