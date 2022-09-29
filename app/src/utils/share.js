import { Share, Platform } from "react-native";
import logEvents from "../services/logEvents";

export const recommendApp = async () => {
  const url = "https://jardinmental.fabrique.social.gouv.fr/";
  try {
    logEvents.logRecommendAppShow();
    const result = await Share.share({
      message:
        `Bonjour,
Je te recommande l’application gratuite et totalement anonyme “Jardin Mental”, qui est super pour suivre son état de bien-être mental et comprendre ce qui influe dessus.

Bonne découverte et à bientôt !` + (Platform.OS === "android" ? "\n" + url : ""),
      url: Platform.OS === "ios" && url,
    });
    if (result?.action === Share.sharedAction) {
      if (result?.activityType) {
        logEvents.logRecommendAppSent(result?.activityType);
      } else {
        logEvents.logRecommendAppSent();
      }
    } else if (result.action === Share.dismissedAction) {
      logEvents.logRecommendAppDismissed();
    }
  } catch (error) {
    logEvents.logRecommendAppError();
  }
};
