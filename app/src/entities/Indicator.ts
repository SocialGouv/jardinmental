import { z } from 'zod';

export const IndicatorTypeSchema = z.enum(['smiley', 'gauge', 'boolean']);
export const IndicatorOrderSchema = z.enum(['ASC', 'DESC']);

export const IndicatorSchema = z.object({
  version: z.number().int().positive(),
  uuid: z.string().uuid().describe('A generated id'),
  name: z.string().min(1).describe(`A name for the indicator. Can be suggested or personnalized one.`), 
  order: IndicatorOrderSchema.describe(`
    Define in which order to display the indicator, from positive to negative or the other way around.`),
  type: IndicatorTypeSchema,
  active: z.boolean(),
  position: z.number().int().min(0).describe(`Indicators are shown in a defined order. The position allow to sort them`),
  created_at: z.date(),
})

export const IndicatorsArraySchema = z.array(IndicatorSchema);

export type Indicator = z.infer<typeof IndicatorSchema>;

