import z from "zod";

export const replySchema = z.object({
    replySubject: z
        .string()
        .min(3, { message: "Le sujet doit contenir au moins 3 caractères" })
        .max(100, { message: "Le sujet ne peut pas dépasser 100 caractères" }),
    replyMessage: z
        .string()
        .min(10, { message: "Le message doit contenir au moins 10 caractères" })
        .max(500, { message: "Le message ne peut pas dépasser 500 caractères" })
});

export type ReplyFormData = z.infer<typeof replySchema>;
