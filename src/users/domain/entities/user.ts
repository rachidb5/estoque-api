export class User {
  id: string;
  username: string;
  email: string;
  phone: string;
  role: 'vendedor' | 'gestor' | 'admin';
  password: string;
  is_email_verified: boolean;
  email_verification_token: string;
  email_verification_expires: Date;
  reset_password_token: string;
  reset_password_expires: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
