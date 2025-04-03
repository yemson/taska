import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email({ message: "이메일 형식이 아닙니다." }),
    password: z
      .string()
      .min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
    passwordConfirmation: z
      .string()
      .min(6, { message: "비밀번호는 6자 이상이어야 합니다." }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirmation"],
  });

export type RegisterSchema = z.infer<typeof registerSchema>;
