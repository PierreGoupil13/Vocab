import { z } from "zod";

/** Transforme une chaîne vide (ou uniquement des espaces) en `undefined`. */
function emptyToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

export const createWordSchema = z.object({
  wordLabel: z.string().trim().min(1, "Le terme est obligatoire."),
  wordMeaning: z.string().trim().min(1, "La traduction est obligatoire."),
  wordInUse: z
    .string()
    .trim()
    .min(1, "L'exemple d'utilisation est obligatoire."),
  url: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .url("L'URL doit être valide (ex: https://...).")
      .optional(),
  ),
  tags: z
    .array(z.string().trim().min(1, "Un tag ne peut pas être vide."))
    .optional()
    .default([]),
});

export type CreateWordInput = z.infer<typeof createWordSchema>;
