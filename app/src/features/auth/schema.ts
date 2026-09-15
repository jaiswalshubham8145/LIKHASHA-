export const loginSchema = {
  email: { required: true, type: 'email' as const },
  password: { required: true, type: 'password' as const, minLength: 1 },
};

export interface LoginInput {
  email: string;
  password: string;
}
