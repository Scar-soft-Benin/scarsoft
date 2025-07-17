// src/schemas/contactSchema.ts
import { z } from "zod";

export const contactSchema = z.object({
    name: z
        .string()
        .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
        .max(50, { message: "Le nom ne peut pas dépasser 50 caractères" }),
    email: z
        .string()
        .email({ message: "Veuillez entrer un email valide" })
        .max(100, { message: "L'email ne peut pas dépasser 100 caractères" }),
    phone: z
        .string()
        .optional()
        .refine((val) => !val || /^\+?\d{8,15}$/.test(val), {
            message:
                "Veuillez entrer un numéro de téléphone valide (10-15 chiffres)"
        }),
    subject: z
        .string()
        .min(3, { message: "Le sujet doit contenir au moins 3 caractères" })
        .max(100, { message: "Le sujet ne peut pas dépasser 100 caractères" }),
    message: z
        .string()
        .min(10, { message: "Le message doit contenir au moins 10 caractères" })
        .max(500, { message: "Le message ne peut pas dépasser 500 caractères" })
});

// TypeScript type for the schema
export type ContactFormData = z.infer<typeof contactSchema>;
