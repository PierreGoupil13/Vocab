"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import {
  createWordSchema,
  type CreateWordInput,
  deleteWordSchema,
  type DeleteWordInput,
} from "./schema";

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

export type DeleteWordResult =
  | { success: true }
  | {
      success: false;
      errors: Partial<Record<keyof DeleteWordInput, string[]>>;
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

/**
 * Supprime un mot (et sa révision associée, via `onDelete: Cascade` côté
 * Prisma) à partir de son identifiant.
 */
export async function deleteWord(
  input: DeleteWordInput,
): Promise<DeleteWordResult> {
  const parsed = deleteWordSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const { id } = parsed.data;

  try {
    await prisma.word.delete({ where: { id } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return { success: false, errors: { id: ["Ce mot n'existe plus."] } };
    }
    throw error;
  }

  return { success: true };
}
