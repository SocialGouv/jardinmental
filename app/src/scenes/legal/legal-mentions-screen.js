import React from "react";
import LegalScreen from "./legal-screen";
import { View, Linking, TouchableOpacity } from "react-native";
import Text from "../../components/MyText";

const LegalMentions = ({ navigation }) => {
  const content = (
    <View className="px-2">
      <Text className="text-blue-900 text-lg font-bold my-2.5">Éditeur de l'application</Text>
      <Text className="text-blue-900 text-base my-2">
        L'application Jardin Mental est éditée par la Direction Générale de la Santé (DGS) au sein de la Fabrique numérique des ministères sociaux
        située :
      </Text>
      <Text className="text-blue-900 text-base my-2">
        14 avenue Duquesne{"\n"}
        75350 Paris SP 07{"\n"}
        France{"\n"}
        Téléphone : 01 40 56 60 00
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-2.5">Directeur de la publication</Text>
      <Text className="text-blue-900 text-base my-2">Monsieur Grégory EMERY, directeur général de la santé</Text>

      <Text className="text-blue-900 text-lg font-bold my-2.5">Hébergement de l'application</Text>
      <Text className="text-blue-900 text-base my-2">Cette application est hébergée par :</Text>
      <Text className="text-blue-900 text-base my-2">
        OVH SAS{"\n"}2 rue Kellermann{"\n"}
        59100 Roubaix{"\n"}
        France{"\n"}
        Téléphone : 1007
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-2.5">Accessibilité</Text>
      <TouchableOpacity onPress={() => Linking.openURL("https://jardinmental.fabrique.social.gouv.fr/accessibilite")}>
        <Text className="text-blue-700 underline">Accessibilité : non-conforme</Text>
      </TouchableOpacity>
      <Text className="text-blue-900 text-base my-2">
        La conformité aux normes d'accessibilité numérique est un objectif ultérieur mais nous tâchons de rendre cette application accessible à toutes
        et à tous.
      </Text>

      <Text className="text-blue-900 text-base my-2">
        Pour en savoir plus sur la politique d'accessibilité numérique de l'Etat{" "}
        <TouchableOpacity onPress={() => Linking.openURL("https://accessibilite.numerique.gouv.fr/")}>
          <Text className="text-blue-700 underline">https://accessibilite.numerique.gouv.fr/</Text>
        </TouchableOpacity>
      </Text>

      <Text className="text-blue-900 text-lg font-bold my-2.5">Signaler un dysfonctionnement</Text>
      <Text className="text-blue-900 text-base my-2">
        Si vous rencontrez un défaut d'accessibilité vous empêchant d'accéder à un contenu ou une fonctionnalité de l'application, merci de nous en
        faire part :{" "}
        <TouchableOpacity onPress={() => Linking.openURL("mailto:jardinmental@fabrique.social.gouv.fr")}>
          <Text className="text-blue-700 underline">jardinmental@fabrique.social.gouv.fr</Text>
        </TouchableOpacity>
      </Text>
      <Text className="text-blue-900 text-base my-2">
        Si vous n'obtenez pas de réponse rapide de notre part, vous êtes en droit de faire parvenir vos doléances ou une demande de saisine au
        Défenseur des droits.
      </Text>
    </View>
  );

  return <LegalScreen navigation={navigation} title="Mentions légales" content={content} />;
};

export default LegalMentions;
