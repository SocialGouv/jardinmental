import z from "zod";

export const BeckSchema = z.object({
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

