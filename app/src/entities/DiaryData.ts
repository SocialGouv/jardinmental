import { z } from "zod";
import { IndicatorSchema } from "./Indicator";

// Schema pour les médicaments (POSOLOGY)
const PosologySchema = z.object({
  id: z.string(),
  name1: z.string(),
  name2: z.string().optional(),
  value: z.string(),
  values: z.array(z.string()),
});

// Schema pour les données Beck (analyse comportementale)
const BeckSchema = z.object({
  date: z.string(),
  time: z.string(),
  where: z.string(),
  who: z.array(z.string()),
  what: z.string(),
  mainEmotion: z.string(),
  mainEmotionIntensity: z.number().min(1).max(10),
  otherEmotions: z.array(z.string()),
  physicalSensations: z.array(z.string()),
  thoughtsBeforeMainEmotion: z.string(),
  trustInThoughsThen: z.number().min(1).max(10),
  memories: z.string(),
  actions: z.string(),
  consequencesForYou: z.string(),
  consequencesForRelatives: z.string(),
  argumentPros: z.string(),
  argumentCons: z.string(),
  nuancedThoughts: z.string(),
  trustInThoughsNow: z.number().min(1).max(10),
  mainEmotionIntensityNuanced: z.number().min(1).max(10),
});

// Schema pour les notes (peut être string ou objet avec notesEvents)
const NotesSchema = z.union([
  z.string(),
  z.object({
    notesEvents: z.string(),
  }),
]);

// Types TypeScript exportés
export type Posology = z.infer<typeof PosologySchema>;
export type Beck = z.infer<typeof BeckSchema>;
export type Notes = z.infer<typeof NotesSchema>;

// Schema for individual DiaryData answers
const DiaryDataAnswerSchema = z.object({
  value: z.union([z.number(), z.boolean()]).optional(),
  userComment: z.string().optional(),
  _indicateur: IndicatorSchema.optional(),
});
export type DiaryDataAnswer = z.infer<typeof DiaryDataAnswerSchema>;

// Schema for all DiaryData answers - combines dynamic indicator answers with fixed questions
const DiaryDataAnswerListSchema = z.record(z.string().describe("The indicator name"), DiaryDataAnswerSchema).describe("User custom indicators");
export type DiaryDataAnswerList = z.infer<typeof DiaryDataAnswerListSchema>;

// Main DiaryData schema
const DiaryEntrySchema = DiaryDataAnswerListSchema.and(
  z.object({
    // use beck.js
    becks: z.record(z.string(), BeckSchema).optional().nullable(),
    // use in drugs.tsx
    POSOLOGY: z.array(PosologySchema).optional().nullable(),
    // use in notes-screen.tsx
    NOTES: NotesSchema.optional().nullable(),
    //
    CONTEXT: z
      .object({
        userComment: z.string().optional(),
      })
      .describe(`Ajoutez une note générale sur votre journée`)
      .optional()
      .nullable(),
    TOXIC: z
      .object({
        value: z.boolean().optional().nullable(),
        userComment: z.string().optional().nullable(),
      })
      .describe(`Avez-vous consommé des substances aujourd'hui ?`)
      .optional()
      .nullable(),
    _indicateur: IndicatorSchema.optional(),
  })
);
export type DiaryEntry = z.infer<typeof DiaryEntrySchema>;

const DiaryDataSchema = z.record(z.string().describe("The date of the entry"), DiaryEntrySchema.nullable());
export type DiaryData = z.infer<typeof DiaryDataSchema>;

const DiaryDataNewEntryInputSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  answers: DiaryEntrySchema,
});
export type DiaryDataNewEntryInput = z.infer<typeof DiaryDataNewEntryInputSchema>;
