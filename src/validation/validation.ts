import { z } from "zod";

export const passwordValidation = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character",
    ),
});

export const MFAcodeValidation = z.object({
  mfaCode: z
    .string()
    .length(6, "MFA code must be exactly 6 digits")
    .regex(/^\d+$/, "MFA code must contain only digits"),
});

export const IntegerSchema = z.number().int({
  message: "Value must be an integer",
});

export const UserInputSchema = z.object({
  name: z.string("Name is required"),
  email: z.email("Invalid email address").optional(),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Phone number must be between 10 and 15 digits")
    .optional(),
});

//       if (error instanceof z.ZodError) {
//   const messages = error.issues.map((issue) => issue.message).join(", ");
//   toast.error(messages);
//   Logger("Validation Error:", messages);
// return;
// }
