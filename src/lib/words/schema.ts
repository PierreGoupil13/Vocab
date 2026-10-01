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

export const deleteWordSchema = z.object({
  id: z.number().int().positive("L'identifiant est obligatoire."),
});

export type DeleteWordInput = z.infer<typeof deleteWordSchema>;

/** Transforme une chaîne vide (ou uniquement des espaces) en `null`. */
function emptyToNull(value: unknown) {
  return typeof value === "string" && value.trim() === "" ? null : value;
}

/**
 * Modification partielle : un champ absent (`undefined`) n'est pas touché en
 * base. Pas de `.default()` ici, sinon un champ non envoyé serait écrasé.
 */
export const modifyWordSchema = z.object({
  id: z.number().int().positive("L'identifiant est obligatoire."),
  wordLabel: z.string().trim().min(1, "Le terme ne peut pas être vide.").optional(),
  wordMeaning: z
    .string()
    .trim()
    .min(1, "La traduction ne peut pas être vide.")
    .optional(),
  wordInUse: z
    .string()
    .trim()
    .min(1, "L'exemple d'utilisation ne peut pas être vide.")
    .optional(),
  // Absent = inchangée, chaîne vide = URL effacée (null en base).
  url: z.preprocess(
    emptyToNull,
    z
      .string()
      .trim()
      .url("L'URL doit être valide (ex: https://...).")
      .nullable()
      .optional(),
  ),
  tags: z
    .array(z.string().trim().min(1, "Un tag ne peut pas être vide."))
    .optional(),
});

export type ModifyWordInput = z.infer<typeof modifyWordSchema>;
