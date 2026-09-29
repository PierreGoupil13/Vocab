"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { createWordSchema, type CreateWordInput } from "./schema";

/** Valeurs SM-2 par défaut pour la toute première révision d'un mot. */
const INITIAL_REVISION = {
  easeFactor: 2.5,
  intervalDays: 0,
  repetitions: 0,
};

// Comme notre mot porte une révision directe, il faut un type word étendu
export type WordWithRevision = Prisma.WordGetPayload<{
  include: { revision: true };
}>;

// Définition du type de retour, mais c'est plus une fonction asynchrone qu'un simple type de retour
export type CreateWordResult =
  | { success: true; word: WordWithRevision }
  | {
      success: false;
      errors: Partial<Record<keyof CreateWordInput, string[]>>;
    };

/**
 * Crée un mot et initialise sa révision SRS (le mot est donc immédiatement
 * disponible pour une première session de révision).
 */
export async function createWord(
  input: CreateWordInput,
): Promise<CreateWordResult> {
  const parsed = createWordSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { wordLabel, wordMeaning, wordInUse, url, tags } = parsed.data;
  const now = new Date();

  const word = await prisma.word.create({
    data: {
      wordLabel,
      wordMeaning,
      wordInUse,
      url,
      tags,
      revision: {
        create: {
          ...INITIAL_REVISION,
          nextReviewDate: now,
          lastReviewDate: now,
        },
      },
    },
    include: { revision: true },
  });

  return { success: true, word };
}
