import { z } from "zod";

// Schema for days of the week mapping
const DaysOfWeekSchema = z
  .object({
    sunday: z.boolean().optional(),
    monday: z.boolean().optional(),
    tuesday: z.boolean().optional(),
    wednesday: z.boolean().optional(),
    thursday: z.boolean().optional(),
    friday: z.boolean().optional(),
    saturday: z.boolean().optional(),
  })
  .describe("Days of the week when the goal is active");

// Schema for individual goal
const GoalSchema = z.object({
  id: z.string().describe("Unique identifier for the goal, usually derived from label"),
  label: z.string().min(1).describe("Display name for the goal"),
  enabled: z.boolean().default(true).describe("Whether the goal is currently active"),
  order: z.number().int().min(0).default(0).describe("Display order for sorting goals"),
  daysOfWeek: DaysOfWeekSchema.optional().describe("Which days of the week this goal applies to"),
  reminder: z.date().nullable().optional().describe("Time for reminder notifications"),
});

// Schema for goal daily record
const GoalRecordSchema = z.object({
  id: z.string().describe("Unique identifier for the record"),
  goalId: z.string().describe("Reference to the goal this record belongs to"),
  value: z.union([z.number(), z.boolean(), z.string()]).optional().describe("The recorded value for the goal"),
  comment: z.string().optional().describe("Optional comment about the goal completion"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .describe("Date of the record"),
});

// Schema for goals data structure (matching localStorage structure)
const GoalsDataSchema = z.object({
  data: z.record(z.string(), GoalSchema).describe("Goals indexed by their ID"),
  byOrder: z.array(z.string()).describe("Array of goal IDs sorted by order"),
});

// Schema for records data structure
const GoalRecordsDataSchema = z.object({
  data: z.record(z.string(), GoalRecordSchema).describe("Records indexed by their ID"),
  byDate: z.record(z.string(), z.array(z.string())).describe("Record IDs grouped by date"),
  byGoalId: z.record(z.string(), z.array(z.string())).describe("Record IDs grouped by goal ID"),
});

// Complete goals storage schema
const GoalStorageSchema = z.object({
  goals: GoalsDataSchema.optional(),
  records: GoalRecordsDataSchema.optional(),
});

// Array schemas for collections
const GoalsArraySchema = z.array(GoalSchema);
const GoalRecordsArraySchema = z.array(GoalRecordSchema);

// Input schemas for API/form operations
const CreateGoalInputSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  enabled: z.boolean().optional().default(true),
  order: z.number().int().min(0).optional().default(0),
  daysOfWeek: DaysOfWeekSchema.optional(),
  reminder: z.date().nullable().optional(),
});

const UpdateGoalInputSchema = CreateGoalInputSchema.partial().extend({
  id: z.string(),
});

const CreateGoalRecordInputSchema = z.object({
  goalId: z.string(),
  value: z.union([z.number(), z.boolean(), z.string()]).optional(),
  comment: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
});

// Goal with records combined schema
const GoalWithRecordsSchema = z.object({
  goal: GoalSchema,
  records: GoalRecordsArraySchema,
});

// TypeScript types
export type DaysOfWeek = z.infer<typeof DaysOfWeekSchema>;
export type Goal = z.infer<typeof GoalSchema>;
export type GoalRecord = z.infer<typeof GoalRecordSchema>;
export type GoalsData = z.infer<typeof GoalsDataSchema>;
export type GoalRecordsData = z.infer<typeof GoalRecordsDataSchema>;
export type GoalStorage = z.infer<typeof GoalStorageSchema>;
export type CreateGoalInput = z.infer<typeof CreateGoalInputSchema>;
export type UpdateGoalInput = z.infer<typeof UpdateGoalInputSchema>;
export type CreateGoalRecordInput = z.infer<typeof CreateGoalRecordInputSchema>;
export type GoalWithRecords = z.infer<typeof GoalWithRecordsSchema>;
