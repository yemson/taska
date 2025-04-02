import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "이메일 형식이 아닙니다." }),
  password: z.string().min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
