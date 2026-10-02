import { beforeEach, describe, expect, test, vi } from "vitest";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { createWord, deleteWord, listWords, modifyWord } from "./actions";

// Remplace le vrai module Prisma par un faux : aucune connexion à Postgres.
// Chaque méthode est une fonction espion (`vi.fn()`) dont on contrôle le
// retour dans chaque test, et qui enregistre comment elle a été appelée.
vi.mock("@/lib/prisma", () => ({
  prisma: {
    word: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Remet les espions à zéro entre deux tests pour qu'ils restent indépendants.
beforeEach(() => {
  vi.clearAllMocks();
});

describe("createWord", () => {
  test("crée le mot avec une révision SRS initiale", async () => {
    // Arrange : ce que la "base" renverra
    const fakeWord = {
      id: 1,
      wordLabel: "chat",
      wordMeaning: "cat",
      wordInUse: "Le chat dort.",
      url: null,
      tags: [],
      revision: null,
    };
    vi.mocked(prisma.word.create).mockResolvedValue(fakeWord as never);

    // Act
    const result = await createWord({
      wordLabel: "  chat  ",
      wordMeaning: "cat",
      wordInUse: "Le chat dort.",
      tags: [],
    });

    // Assert : le résultat renvoyé à l'appelant
    expect(result).toEqual({ success: true, word: fakeWord });

    // Assert : ce que l'action a réellement demandé à Prisma
    expect(prisma.word.create).toHaveBeenCalledOnce();
    expect(prisma.word.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        wordLabel: "chat", // le trim() de Zod a bien été appliqué
        revision: {
          create: expect.objectContaining({
            easeFactor: 2.5,
            intervalDays: 0,
            repetitions: 0,
          }),
        },
      }),
      include: { revision: true },
    });
  });
  test("refuse un terme vide sans appeler Prisma", async () => {
    // Arrange : rien à préparer, Prisma ne doit pas être appelé

    // Act
    const result = await createWord({
      wordLabel: "   ",
      wordMeaning: "cat",
      wordInUse: "Le chat dort.",
      tags: [],
    });

    // Assert
    expect(result).toEqual({
      success: false,
      errors: { wordLabel: ["Le terme est obligatoire."] },
    });
    expect(prisma.word.create).not.toHaveBeenCalled();
  });

  test("refuse une URL invalide sans appeler Prisma", async () => {
    const result = await createWord({
      wordLabel: "chat",
      wordMeaning: "cat",
      wordInUse: "Le chat dort.",
      url: "pas-une-url",
      tags: [],
    });

    expect(result).toEqual({
      success: false,
      errors: { url: ["L'URL doit être valide (ex: https://...)."] },
    });
    expect(prisma.word.create).not.toHaveBeenCalled();
  });
});

describe("listWords", () => {
  test("renvoie les mots avec leur révision, du plus récent au plus ancien", async () => {
    const fakeWords = [
      { id: 2, wordLabel: "chien", revision: null },
      { id: 1, wordLabel: "chat", revision: null },
    ];
    vi.mocked(prisma.word.findMany).mockResolvedValue(fakeWords as never);

    const result = await listWords();

    expect(result).toEqual({ success: true, words: fakeWords });
    expect(prisma.word.findMany).toHaveBeenCalledWith({
      include: { revision: true },
      orderBy: { id: "desc" },
    });
  });

  test("renvoie un message générique si la base échoue", async () => {
    vi.mocked(prisma.word.findMany).mockRejectedValue(new Error("DB down"));
    // listWords journalise l'erreur : on coupe console.error pour garder une
    // sortie de test propre (et on vérifie au passage qu'il a été appelé).
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await listWords();

    expect(result).toEqual({
      success: false,
      error: "Impossible de récupérer la liste des mots.",
    });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe("modifyWord", () => {
  test("n'envoie à Prisma que les champs fournis", async () => {
    const fakeWord = { id: 1, wordLabel: "chaton", revision: null };
    vi.mocked(prisma.word.update).mockResolvedValue(fakeWord as never);

    const result = await modifyWord({ id: 1, wordLabel: "  chaton " });

    expect(result).toEqual({ success: true, word: fakeWord });
    // toHaveBeenCalledWith compare exactement : si `data` contenait aussi
    // `tags: []` ou `url: undefined`... le test échouerait. C'est ce qui
    // garantit qu'un champ non envoyé n'écrase pas la valeur en base.
    expect(prisma.word.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { wordLabel: "chaton" },
      include: { revision: true },
    });
  });

  test("efface l'URL quand une chaîne vide est envoyée", async () => {
    vi.mocked(prisma.word.update).mockResolvedValue({} as never);

    await modifyWord({ id: 1, url: "" });

    expect(prisma.word.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { url: null } }),
    );
  });

  test("refuse de vider un champ obligatoire", async () => {
    const result = await modifyWord({ id: 1, wordMeaning: "   " });

    expect(result).toEqual({
      success: false,
      errors: { wordMeaning: ["La traduction ne peut pas être vide."] },
    });
    expect(prisma.word.update).not.toHaveBeenCalled();
  });

  test("renvoie une erreur sur id si le mot n'existe plus", async () => {
    vi.mocked(prisma.word.update).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "test",
      }),
    );

    const result = await modifyWord({ id: 42, wordLabel: "chat" });

    expect(result).toEqual({
      success: false,
      errors: { id: ["Ce mot n'existe plus."] },
    });
  });

  test("laisse remonter les autres erreurs Prisma", async () => {
    const dbError = new Error("Connexion perdue");
    vi.mocked(prisma.word.update).mockRejectedValue(dbError);

    // `rejects` : on attend que la promesse échoue, avec cette erreur précise.
    await expect(modifyWord({ id: 1, wordLabel: "chat" })).rejects.toBe(
      dbError,
    );
  });
});

describe("deleteWord", () => {
  test("supprime le mot à partir de son id", async () => {
    vi.mocked(prisma.word.delete).mockResolvedValue({} as never);

    const result = await deleteWord({ id: 1 });

    expect(result).toEqual({ success: true });
    expect(prisma.word.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  test("refuse un id invalide sans appeler Prisma", async () => {
    const result = await deleteWord({ id: -1 });

    expect(result).toEqual({
      success: false,
      errors: { id: ["L'identifiant est obligatoire."] },
    });
    expect(prisma.word.delete).not.toHaveBeenCalled();
  });

  test("renvoie une erreur sur id si le mot n'existe plus", async () => {
    // Arrange : on simule l'erreur que Prisma lève quand la ligne est absente
    vi.mocked(prisma.word.delete).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Record not found", {
        code: "P2025",
        clientVersion: "test",
      }),
    );

    // Act
    const result = await deleteWord({ id: 42 });

    // Assert
    expect(result).toEqual({
      success: false,
      errors: { id: ["Ce mot n'existe plus."] },
    });
    expect(prisma.word.delete).toHaveBeenCalledWith({ where: { id: 42 } });
  });
});
