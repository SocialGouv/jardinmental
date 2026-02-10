import React from "react";
import LegalScreen from "./legal-screen";
import { View, Linking, TouchableOpacity } from "react-native";
import { Typography } from "@/components/Typography";
import Text from "../../components/MyText";

const LegalMentions = ({ navigation }) => {
  const content = (
    <View className="px-2">
      <Typography className="text-blue-900 text-lg font-bold my-2.5">Éditeur de l'application</Typography>
      <Typography className="text-blue-900 text-base my-2">
        L’application Jardin Mental est édité par la Caisse nationale d’assurance maladie :
      </Typography>
      <Typography className="text-blue-900 text-base my-2">
        26 – 50 Immeuble Frontalis{"\n"}
        50 avenue du Professeur André Lemierre{"\n"}
        75986 Paris Cedex 20{"\n"}
        Téléphone : 01 72 60 10 00
      </Typography>

      <Typography className="text-blue-900 text-lg font-bold my-2.5">Directeur de la publication</Typography>
      <Typography className="text-blue-900 text-base my-2">Monsieur Thomas Fatome, directeur général</Typography>

      <Typography className="text-blue-900 text-lg font-bold my-2.5">Hébergement de l'application</Typography>
      <Typography className="text-blue-900 text-base my-2">Cette application est hébergée par :</Typography>
      <Typography className="text-blue-900 text-base my-2">
        OVH SAS{"\n"}2 rue Kellermann{"\n"}
        59100 Roubaix{"\n"}
        France{"\n"}
        Téléphone : 1007
      </Typography>

      <Typography className="text-blue-900 text-lg font-bold my-2.5">Accessibilité</Typography>
      <TouchableOpacity
        onPress={() => Linking.openURL("https://www.ameli.fr/assure/jardin-mental/accessibilite")}
        accessibilityRole="link"
        accessibilityLabel="Consulter la déclaration d'accessibilité : non-conforme"
        accessibilityHint="Ouvre le lien dans le navigateur"
      >
        <Typography className="text-blue-700 underline">Accessibilité : non-conforme</Typography>
      </TouchableOpacity>
      <Typography className="text-blue-900 text-base my-2">
        La conformité aux normes d'accessibilité numérique est un objectif ultérieur mais nous tâchons de rendre cette application accessible à toutes
        et à tous.
      </Typography>

      <Typography className="text-blue-900 text-base my-2">
        Pour en savoir plus sur la politique d'accessibilité numérique de l'Etat{" "}
        <TouchableOpacity onPress={() => Linking.openURL("https://accessibilite.numerique.gouv.fr/")}>
          <Typography className="text-blue-700 underline">https://accessibilite.numerique.gouv.fr/</Typography>
        </TouchableOpacity>
      </Typography>

      <Typography className="text-blue-900 text-lg font-bold my-2.5">Signaler un dysfonctionnement</Typography>
      <Typography className="text-blue-900 text-base my-2">
        Si vous rencontrez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité de l'application, merci de nous en
        faire part :{" "}
        <TouchableOpacity onPress={() => Linking.openURL("mailto:jardinmental@fabrique.social.gouv.fr")}>
          <Typography className="text-blue-700 underline">jardinmental@fabrique.social.gouv.fr</Typography>
        </TouchableOpacity>
      </Typography>
      <Typography className="text-blue-900 text-base my-2">
        Si vous n'obtenez pas de réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au
        Défenseur des droits.
      </Typography>
    </View>
  );

  return <LegalScreen navigation={navigation} title="Mentions légales" content={content} />;
};

export default LegalMentions;
