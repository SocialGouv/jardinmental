import { INDICATORS_CATEGORIES } from "@/entities/Indicator"

interface EncouragementScreenData {
    title: string,
    description: string,
    extraInfo: string
}

// @todo define what we should exaclty do for this content
export const ENCOURAGEMENT_DATA: Record<INDICATORS_CATEGORIES, EncouragementScreenData> = {
    "Emotions/sentiments": {
      title: 'Merci d’avoir pris ce moment pour observer votre humeur.',
      description: `C'est noté`,
      extraInfo: `🌤 Suivre son humeur au quotidien aide à repérer les variations et à mieux comprendre ses émotions.`
    },
    "Comportements": {
      title: 'Merci d’avoir pris ce moment pour observer votre comportement.',
      description: `C'est noté`,
      extraInfo: `🌱 Lorem ipsum`
    },
    "Pensées": {
      title: 'Merci d’avoir pris ce moment pour observer vos pensées négatives.',
      description: `C'est noté`,
      extraInfo: `🧠 Identifier ses pensées négatives permet de mieux les apprivoiser et de prendre du recul.`
    },
    "Manifestations physiques": {
      title: 'Merci d’avoir pris ce moment pour observer votre sommeil.',
      description: `C'est noté`,
      extraInfo: `🛌 En France, 32 % des adultes se déclarent insatisfaits de leur sommeil. En faire le suivi, c’est déjà prendre soin de soi. (ifop mars 2022).`
    }
  }