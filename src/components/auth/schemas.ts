import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Confira o email.").email("Confira o email: falta algo, como o .com"),
  password: z.string().min(1, "Digite sua senha."),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "Digite seu nome.").max(80),
  lastName: z.string().trim().min(1, "Digite seu sobrenome.").max(120),
  email: z
    .string()
    .trim()
    .min(1, "Confira o email.")
    .email("Confira o email: falta algo, como o .com")
    .max(254),
  password: z
    .string()
    .min(8, "Use pelo menos 8 caracteres.")
    .max(100, "Senha muito longa."),
});

export type RegisterValues = z.infer<typeof registerSchema>;

export const forgotSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Confira o email.")
    .email("Confira o email: falta algo, como o .com"),
});

export type ForgotValues = z.infer<typeof forgotSchema>;

export const resetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Use pelo menos 8 caracteres.")
      .max(100, "Senha muito longa."),
    confirm: z.string().min(1, "Repita a nova senha."),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "As senhas não são iguais.",
  });

export type ResetValues = z.infer<typeof resetSchema>;
