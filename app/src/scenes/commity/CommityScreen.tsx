import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Header from "../../components/Header";
import { TW_COLORS } from "@/utils/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import EyeIcon from "@assets/svg/icon/Eye";
import { useBottomSheet } from "@/context/BottomSheetContext";
import OrganisationIcon from "@assets/svg/icon/Organisation";
import PeopleIcon from "@assets/svg/icon/People";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";

interface CommityCategoriesProps {
  navigation: any;
}

interface CategoryCardProps {
  number: number;
  title: string;
  onPress: () => void;
}

interface CommityEntity {
  name: string;
  role: string;
  role2: string;
  organization: string;
  isOrganization?: boolean;
}

const commityList: CommityEntity[] = [
  {
    name: "Arcella-Giraux Pilar",
    role: "Conseillère médicale santé mentale des adultes",
    role2: "",
    organization: "Direction générale de la santé",
  },
  {
    name: "Boinet Ingrid",
    role: "Chargée du programme « Les déterminants de la santé mentale »",
    role2: "",
    organization: "Direction générale de la santé",
  },
  {
    name: "Caria Aude",
    role: "Directrice",
    role2: "",
    organization: "Psycom-Santé mentale Info",
  },
  {
    name: "Javelot Hervé",
    role: "Pharmacien hospitalier",
    role2: "Responsable du Centre de Ressources et d'Expertise en Psychopharmacologie (CREPP)",
    organization: "Etablissement Public de Santé Alsace Nord (EPSAN)",
  },
  {
    name: "Leboyer Marion",
    role: "Professeur de psychiatrie (UPEC)",
    role2: "Directrice générale",
    organization: "FondaMental",
  },
  {
    name: "Navarro Nicolas",
    role: "Psychiatre addictologue",
    role2: "",
    organization: "CHU Toulouse",
  },
  {
    name: "Perrot Jeanne",
    role: "Médecin-conseil en santé publique",
    role2: "",
    organization: "Caisse nationale de l’Assurance Maladie",
  },
  {
    name: "Rousselet Anne-Victoire",
    role: "Psychologue et psychothérapeute",
    role2: "",
    organization: "GHU - Hôpital Sainte-Anne",
  },
  {
    name: "Staedel Bérénice",
    role: "Directrice de programmes",
    role2: "",
    organization: "Centre collaborateur de l'OMS pour la recherche et la formation en santé mentale (CCOMS)",
  },
  {
    name: "Vaiva Guillaume",
    role: "Directeur scientifique",
    role2: "",
    organization: "Centre National de Ressources et de Résilience pour les psychotraumatismes (Cn2r)",
  },
  {
    name: "Vidal Noor",
    role: "Médiatrice de santé-paire en psychiatrie",
    role2: "",
    organization: "Centre Hospitalier Intercommunal de Mont de Marsan",
  },
  {
    name: "",
    role: "",
    role2: "",
    isOrganization: true,
    organization: "Délégation Ministérielle à la Santé Mentale et à la Psychiatrie",
  },
  {
    name: "",
    role: "",
    role2: "",
    isOrganization: true,
    organization: "Nightline France",
  },
  {
    name: "",
    role: "",
    role2: "",
    isOrganization: true,
    organization: "Réseau Transition/Institut de Psychiatrie",
  },
  {
    name: "",
    role: "",
    role2: "",
    isOrganization: true,
    organization: "Premiers Secours en Santé Mentale France",
  },
];

const CommityBottomSheet = ({ entity }: { entity: CommityEntity }) => {
  return (
    <View className="items-center flex-col p-4 space-y-4 justify-center pb-10">
      {entity.isOrganization && <OrganisationIcon />}
      {!entity.isOrganization && <PeopleIcon />}

      <Text className={mergeClassNames(typography.textXlBold, "text-cnam-cyan-600-darken-20")}>
        {entity.isOrganization ? entity.organization : entity.name}
      </Text>
      {entity.role && <Text className={mergeClassNames(typography.textLgRegular, "text-cnam-primary-800 text-center")}>{entity.role}</Text>}
      {entity.role2 && <Text className={mergeClassNames(typography.textSmRegular, "text-cnam-primary-800 text-center")}>{entity.role2}</Text>}
      {!entity.isOrganization && (
        <View className="flex-row bg-cnam-cyan-lighten-80 items-center mb-8 space-x-1 rounded-full px-3 py-1 self-center">
          <Text className={mergeClassNames(typography.textXsSemibold, "text-cnam-primary-950")}>{entity.organization}</Text>
        </View>
      )}
    </View>
  );
};

const CommityCategories: React.FC<CommityCategoriesProps> = ({ navigation }) => {
  const { showBottomSheet } = useBottomSheet();

  return (
    <AnimatedHeaderScrollScreen
      title={"Comité éditorial et scientifique"}
      handlePrevious={() => {
        navigation.goBack();
      }}
      smallHeader={true}
      navigation={navigation}
      showBottomButton={false}
      scrollViewBackground={TW_COLORS.GRAY_50}
    >
      <View className="p-4 mt-4">
        <View className="mb-6 bg-cnam-cyan-lighten-90">
          <Text className="text-cnam-primary-800 text-base leading-6 p-4">
            Jardin Mental est accompagné d’un <Text className={mergeClassNames(typography.textMdSemibold)}>comité éditorial et scientifique</Text>,
            qui veille à la qualité, la rigueur scientifique et la véracité médicale des contenus proposés sur l’application.
          </Text>
          <Text className="text-cnam-primary-800 text-base leading-6 p-4">
            Il réunit des professionnels de santé, chercheurs et institutions engagés dans la prévention et la santé mentale.
          </Text>
        </View>
        <Text className={mergeClassNames(typography.textXlBold, "text-cnam-primary-800")}>Découvrez les membres du comité</Text>
        <View className="flex-col mt-4">
          {commityList.map((item, index) => (
            <TouchableOpacity
              onPress={() => {
                showBottomSheet(<CommityBottomSheet entity={item} />);
              }}
              className={mergeClassNames(
                "flex-row bg-white items-center justify-between p-4",
                "border-b-cnam-primary-100 border-b-2",
                index === 0 ? "rounded-t-2xl" : "",
                index === commityList.length - 1 ? "rounded-b-2xl border-b-0" : ""
              )}
            >
              <View className="flex-col basis-[80%]">
                <View className="flex-row">
                  {item.isOrganization && (
                    <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>{item.organization}</Text>
                  )}
                  {!item.isOrganization && (
                    <>
                      <Text className={mergeClassNames(typography.textMdSemibold, "text-cnam-cyan-700-darken-40")}>{item.name}</Text>
                    </>
                  )}
                </View>
                {item.role && (
                  <Text numberOfLines={1} ellipsizeMode="tail" className={mergeClassNames(typography.textSmMedium, "text-gray-700")}>
                    {item.role}
                  </Text>
                )}
              </View>
              <View className="px-2 basis-[20%] items-end px-2">
                <EyeIcon color={TW_COLORS.CNAM_PRIMARY_800} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </AnimatedHeaderScrollScreen>
  );
};

export default CommityCategories;
