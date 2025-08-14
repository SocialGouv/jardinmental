import { z } from "zod";
import { categories } from "../utils/constants";
import { NEW_INDICATORS_CATEGORIES, NEW_INDICATORS_SUBCATEGORIES } from "@/utils/liste_indicateurs.1";
import { v4 as uuidv4 } from "uuid";
import { INDICATORS_CATEGORIES } from "./IndicatorCategories";

export enum INDICATOR_TYPE {
  "smiley" = "smiley",
  "gauge" = "gauge",
  "boolean" = "boolean",
}

export enum INDICATOR_ORDER {
  "ASC" = "ASC",
  "DESC" = "DESC",
}

export const IndicatorTypeSchema = z.nativeEnum(INDICATOR_TYPE);
export const IndicatorOrderSchema = z.enum(["ASC", "DESC"]);
export const IndicatorPredefinedDomaineSchema = z.nativeEnum(categories);
export type IndicatorPredefinedDomaine = z.infer<typeof IndicatorPredefinedDomaineSchema>;

export const IndicatorSchema = z.object({
  version: z.number().int().positive(),
  uuid: z.string().uuid().describe("A generated id"),
  description: z.string().optional().describe("A description for this indicator when it is given."),
  predefinedIndicatorDomaine: IndicatorPredefinedDomaineSchema.optional(),
  category: z.nativeEnum(INDICATORS_CATEGORIES),
  newCategories: z.array(z.nativeEnum(NEW_INDICATORS_CATEGORIES).optional()),
  mainCategory: z.nativeEnum(NEW_INDICATORS_CATEGORIES).optional(),
  name: z.string().min(1).describe(`A name for the indicator. Can be suggested or personnalized one.`),
  order: IndicatorOrderSchema.describe(`
    Define in which order to display the indicator, from positive to negative or the other way around.`),
  type: IndicatorTypeSchema,
  active: z.boolean(),
  position: z.number().int().min(0).describe(`Indicators are shown in a defined order. The position allow to sort them`),
  created_at: z.date(),
});

export const PredefineIndicatorSchema = z.object({
  uuid: z.string().uuid(), // Vérifie un UUID valide
  name: z.string().min(1), // Non vide
  category: z.nativeEnum(INDICATORS_CATEGORIES),
  type: IndicatorTypeSchema,
  order: IndicatorOrderSchema.describe(`
    Define in which order to display the indicator, from positive to negative or the other way around.`),
});

export type PredefineIndicatorSchemaType = z.infer<typeof PredefineIndicatorSchema>;

export const PredefineIndicatorV2Schema = z.object({
  uuid: PredefineIndicatorSchema.shape.uuid,
  name: PredefineIndicatorSchema.shape.name,
  category: PredefineIndicatorSchema.shape.category,
  categories: z.array(z.nativeEnum(NEW_INDICATORS_CATEGORIES)),
  subcategories: z.array(z.nativeEnum(NEW_INDICATORS_SUBCATEGORIES)).optional(),
  mainCategory: z.nativeEnum(NEW_INDICATORS_CATEGORIES),
  type: PredefineIndicatorSchema.shape.type,
  priority: z.number(),
  order: PredefineIndicatorSchema.shape.order,
  new: z.boolean().optional(),
  isGeneric: z.boolean().optional(),
});

export type PredefineIndicatorV2SchemaType = z.infer<typeof PredefineIndicatorV2Schema>;

export const IndicatorsArraySchema = z.array(IndicatorSchema);

export type Indicator = z.infer<typeof IndicatorSchema>;

export const generateIndicatorFromPredefinedIndicator = (predefinedIndicator: PredefineIndicatorV2SchemaType): Indicator => {
  // when predefinedIndicator is generic, we create a unique indicator from it.
  // the user can then edit the name of this indicator and eventually add the same
  // predefinedIndicator
  return {
    uuid: predefinedIndicator.isGeneric ? uuidv4() : predefinedIndicator.uuid,
    name: predefinedIndicator.name,
    category: predefinedIndicator.category,
    newCategories: predefinedIndicator.categories,
    mainCategory: predefinedIndicator.mainCategory || predefinedIndicator.categories[0],
    type: predefinedIndicator.type,
    order: predefinedIndicator.order,
    version: 3,
    active: true,
    position: 0,
    created_at: new Date(),
  };
};
