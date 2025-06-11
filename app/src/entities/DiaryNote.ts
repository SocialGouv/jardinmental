import { z } from 'zod';

export const DiaryNoteValueSchema = z.object({
  id: z.string(),
  value: z.string(),
});

export const DiaryNoteDaySchema = z.object({
  values: z.array(DiaryNoteValueSchema),
});

export const DiaryNotesSchema = z.record(z.string(), DiaryNoteDaySchema);

export type DiaryNoteValue = z.infer<typeof DiaryNoteValueSchema>;
export type DiaryNoteDay = z.infer<typeof DiaryNoteDaySchema>;
export type DiaryNotes = z.infer<typeof DiaryNotesSchema>;

export const validateDiaryNotes = (data: unknown): DiaryNotes => {
  return DiaryNotesSchema.parse(data);
};

export const validateDiaryNoteDay = (day: unknown): DiaryNoteDay => {
  return DiaryNoteDaySchema.parse(day);
};

export const validateDiaryNoteValue = (noteValue: unknown): DiaryNoteValue => {
  return DiaryNoteValueSchema.parse(noteValue);
};

export const createDiaryNoteValue = (id: string, value: string): DiaryNoteValue => {
  return validateDiaryNoteValue({ id, value });
};

export const createDiaryNoteDay = (values: DiaryNoteValue[]): DiaryNoteDay => {
  return validateDiaryNoteDay({ values });
};

export const addNoteToDiaryDay = (
  existingDay: DiaryNoteDay | undefined,
  newNote: DiaryNoteValue
): DiaryNoteDay => {
  const currentValues = existingDay?.values || [];
  return createDiaryNoteDay([...currentValues, newNote]);
};

export const updateNoteInDiaryDay = (
  day: DiaryNoteDay,
  noteId: string,
  newValue: string
): DiaryNoteDay => {
  const updatedValues = day.values.map(note => 
    note.id === noteId ? { ...note, value: newValue } : note
  );
  return createDiaryNoteDay(updatedValues);
};

export const removeNoteFromDiaryDay = (
  day: DiaryNoteDay,
  noteId: string
): DiaryNoteDay => {
  const filteredValues = day.values.filter(note => note.id !== noteId);
  return createDiaryNoteDay(filteredValues);
};
