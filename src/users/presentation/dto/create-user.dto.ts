export class CreateUserDto {
  username: string;
  email: string;
  phone: string;
  password: string;
  role?: 'vendedor' | 'gestor' | 'admin';
}
