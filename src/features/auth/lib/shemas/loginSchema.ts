import { z } from 'zod';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>\/?]).{8,20}$/;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email('Invalid email (loginSchema)')
    .regex(emailRegex, {message: 'Invalid email adress'}),
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(3, {message: 'Password must be at least 8 characters long'})
    .regex(passwordRegex, {message: 'Invalid password 😔'}),
  rememberMe: z.boolean().optional(),
  captcha: z.string().optional(), // optional() означает не обязательное поле
})

export type LoginArgs = z.infer<typeof loginSchema>