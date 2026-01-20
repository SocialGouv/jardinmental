import { Typography } from "@/components/Typography";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import { Dimensions, ScrollView, View, Text, Image, Platform } from "react-native";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

const androidModusOperandi = (
  <View className="space-y-2">
    <View className="bg-gray-100 rounded-2xl p-4 space-y-4">
      <Typography className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900 font-bold")}>
        Etape 1 - Envoyer le fichier par email
      </Typography>
      <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
        Sélectionner votre application email pour vous envoyer le fichier à vous même afin de pouvoir l'ouvrir depuis un ordinateur
      </Typography>
      <View className="px-4">
        <Image
          style={{ width: "100%", height: undefined, aspectRatio: 408 / 480 }}
          resizeMode="contain"
          source={require("@assets/imgs/tools/modus-operandi-android/gps-1.png")}
        />
      </View>
    </View>
    <View className="bg-gray-100 rounded-2xl p-4 space-y-4">
      <Typography className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900 font-bold")}>
        Etape 2 - Compléter le fichier
      </Typography>
      <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
        Depuis un ordinateur, récupérer le fichier dans votre boite mail afin de le compléter.{" "}
      </Typography>
      <Image
        style={{ width: "100%", height: undefined, aspectRatio: 622 / 288 }}
        resizeMode="contain"
        source={require("@assets/imgs/tools/modus-operandi-android/gps-2.png")}
      />
    </View>
    <View className="bg-gray-100 rounded-2xl p-4 space-y-4">
      <Typography className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900 font-bold")}>Etape 3 - Stocker le fichier</Typography>
      <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
        Une fois complété, stocker le fichier sur votre téléphone afin de pouvoir y avoir accès en cas de besoin.ous rendant dans votre application
        "Fichiers", cliquez sur le GPS pour l'ouvrir, puis sur l'icône "crayon" pour l'éditer.
      </Typography>
      <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
        Pour cela vous pouvez le mettre un Google Drive ou vous l'envoyer à nouveau par email afin de le conserver dans vos mails.
      </Typography>
      <Image
        style={{ width: "100%", height: undefined, aspectRatio: 622 / 288 }}
        resizeMode="contain"
        source={require("@assets/imgs/tools/modus-operandi-android/gps-3.png")}
      />
    </View>
  </View>
);

const iosModusOperandi = (
  <View className="space-y-4">
    <Typography className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-900")}>
      Option 1 - Enregistrement et modification sur téléphone
    </Typography>
    <View className="bg-gray-100 rounded-2xl p-4 space-y-4">
      <Typography className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900")}>Etape 1 - Enregistrer le fichier</Typography>
      <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
        Avoir après cliquer sur "Télécharger le fichier" dans Jardin Mental, sélectionner l'option "Enregistrer dans Fichiers"
      </Typography>
      <View className="px-4">
        <Image
          style={{ width: "100%", aspectRatio: 408 / 334, height: undefined }}
          resizeMode="contain"
          source={require("@assets/imgs/tools/modus-operandi-ios/ios-gps-1.png")}
        />
      </View>
      <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
        Valider l'enregistrement dans vos fichiers téléphone en cliquant sur "Enregistrer"
      </Typography>
      <View className="px-4">
        <Image
          style={{ width: "100%", aspectRatio: 410 / 224, height: undefined }}
          resizeMode="contain"
          source={require("@assets/imgs/tools/modus-operandi-ios/ios-gps-2.png")}
        />
      </View>
    </View>
    <View className="bg-gray-100 rounded-2xl p-4 space-y-4">
      <Typography className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900")}>Etape 2 - Éditer le fichier</Typography>
      <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
        En vous rendant dans votre application "Fichiers", cliquez sur le GPS pour l'ouvrir, puis sur l'icône "crayon" pour l'éditer.
      </Typography>
      <View className="px-4">
        <Image
          style={{ width: "100%", aspectRatio: 434 / 522, height: undefined }}
          resizeMode="contain"
          source={require("@assets/imgs/tools/modus-operandi-ios/ios-gps-3.png")}
        />
      </View>
    </View>
    <View className="bg-gray-100 rounded-2xl p-4 space-y-4">
      <Typography className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-900")}>Etape 3 - Partager le fichier</Typography>
      <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
        Une fois celui-ci complété, il est enregistré dans vos fichiers. Vous pouvez également le partager par messages ou mail, ou encore l'imprimer.
      </Typography>
      <View className="px-4">
        <Image
          style={{ width: "100%", aspectRatio: 410 / 592, height: undefined }}
          resizeMode="contain"
          source={require("@assets/imgs/tools/modus-operandi-ios/ios-gps-4.png")}
        />
      </View>
    </View>
    <View className="py-6 space-y-4">
      <Typography className={mergeClassNames(typography.textXlSemibold, "text-cnam-primary-900")}>
        Option 2 - Modification et sauvegarde sur ordinateur
      </Typography>
      <View className="bg-gray-100 rounded-2xl p-4 space-y-4">
        <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left")}>
          Vous pouvez également vous envoyer ce document par mail afin de le compléter sur ordinateur plus tard, et de le stocker ailleurs que sur
          votre téléphone.{" "}
        </Typography>
        <View className="px-4">
          <Image
            style={{ width: "100%", aspectRatio: 410 / 272, height: undefined }}
            resizeMode="contain"
            source={require("@assets/imgs/tools/modus-operandi-ios/ios-gps-5.png")}
          />
        </View>
      </View>
    </View>
  </View>
);

export const ModusOperandiBottomSheet = () => {
  return (
    <View className="flex-1">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
        style={{ paddingVertical: 20, height: height90vh }}
      >
        <View className="mx-4 space-y-6">
          <View className="p-2 self-start" style={{ backgroundColor: "#F5EFF8" }}>
            <Typography style={{ color: "#201224" }}>Mesures anticipées en psychiatrie</Typography>
          </View>
          <Typography className={mergeClassNames(typography.textXlBold, "text-cnam-primary-900")}>
            Mode opératoire - Compléter et sauvegarder ses directives anticipées
          </Typography>
          {Platform.OS === "android" && androidModusOperandi}
          {Platform.OS === "ios" && iosModusOperandi}
        </View>
      </ScrollView>
    </View>
  );
};
