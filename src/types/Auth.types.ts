import { z } from "zod";

/* ---------------- USER DATA ---------------- */
export const UserDataTypeschema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.email(),
  profileImage: z.string().nullable(),
});

export type UserDataType = z.infer<typeof UserDataTypeschema>;

/* ---------------- LOGIN ---------------- */
export const LoginDatatypeSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginDatatype = z.infer<typeof LoginDatatypeSchema>;

/* ---------------- SIGN UP ---------------- */
export const SignUpDatatypeSchema = z.object({
  name: z.string().optional(),
  email: z.email().optional(),
  password: z.string().optional(),
  code: z.string().optional(),
});

export type SignUpDatatype = z.infer<typeof SignUpDatatypeSchema>;

/* ---------------- ERROR ---------------- */
export const ErrorTypeSchema = z.object({
  loginError: z.string().nullable().optional(),
  MFAError: z.string().nullable().optional(),
  twoFaError: z.string().nullable().optional(),
  signUpConfirmationError: z.string().nullable().optional(),
  signUpError: z.string().nullable().optional(),
  refreshError: z.string().nullable().optional(),
});

export type ErrorType = z.infer<typeof ErrorTypeSchema>;

/* ---------------- VALIDATION SCHEMAS ---------------- */

export const MFAverificationSchema = z.object({
  email: z.email("Invalid email address"),
  mfaCode: z
    .string()
    .length(6, "MFA code must be exactly 6 digits")
    .regex(/^\d+$/, "MFA code must contain only digits"),
});
// z infer extract types from zod schemas and define types for user data, login, sign up, and error handling.
