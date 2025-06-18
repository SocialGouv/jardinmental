import { IndicatorCategory } from "../../../entities/Indicator";

interface EncouragementScreenData {
    title: string,
    description: string,
    extraInfo: string
}

export const ENCOURAGEMENT_DATA: Record<IndicatorCategory, EncouragementScreenData> = {
    "Emotions/sentiments": {
      title: 'Merci d’avoir pris ce moment pour observer votre humeur.',
      description: `C'est noté`,
      extraInfo: `🌤 Suivre son humeur au quotidien aide à repérer les variations et à mieux comprendre ses émotions.`
    },
    "ANXIETY": {
      title: 'Merci d’avoir pris ce moment pour observer votre anxiété.',
      description: `C'est noté`,
      extraInfo: `🌱 Prendre conscience de son niveau d’anxiété est une première étape pour mieux la gérer.`
    },
    BADTHOUGHTS: {
      title: 'Merci d’avoir pris ce moment pour observer vos pensées négatives.',
      description: `C'est noté`,
      extraInfo: `🧠 Identifier ses pensées négatives permet de mieux les apprivoiser et de prendre du recul.`
    },
    SENSATIONS: {
      title: 'Merci d’avoir pris ce moment pour observer vos sensations.',
      description: `C'est noté`,
      extraInfo: `👁 Être à l’écoute de ses sensations physiques aide à mieux comprendre les signaux de son corps.`
    },
    DAILYACTIVITIES: {
      title: 'Merci d’avoir pris ce moment pour observer vos activités quotidiennes.',
      description: `C'est noté`,
      extraInfo: `🏃 Suivre ses activités aide à trouver un bon équilibre entre action et repos.`
    },
    COMMUNICATION: {
      title: 'Merci d’avoir pris ce moment pour observer votre communication.',
      description: `C'est noté`,
      extraInfo: `💬 Être attentif à ses échanges avec les autres est une clé pour des relations plus sereines.`
    },
    "Manifestations physiques": {
      title: 'Merci d’avoir pris ce moment pour observer votre sommeil.',
      description: `C'est noté`,
      extraInfo: `🛌 En France, 32 % des adultes se déclarent insatisfaits de leur sommeil. En faire le suivi, c’est déjà prendre soin de soi. (ifop mars 2022).`
    }
  }