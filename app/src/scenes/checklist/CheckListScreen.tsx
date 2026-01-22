import { Screen } from "@/components/Screen";
import { mergeClassNames } from "@/utils/className";
import { iconBorderColors, iconColors, TW_COLORS } from "@/utils/constants";
import { getGoalsTracked } from "@/utils/localStorage/goals";
import { isReminderActive } from "@/utils/reminder";
import { typography } from "@/utils/typography";
import Analytics from "@assets/svg/icon/Analytics";
import ArrowIcon from "@assets/svg/icon/Arrow";
import Bell from "@assets/svg/icon/Bell";
import Goal from "@assets/svg/icon/Goal";
import Health from "@assets/svg/icon/Health";
import Profile from "@assets/svg/icon/Profile";
import WinkSmiley from "@assets/svg/icon/WinkSmiley";
import CheckMarkIcon from "@assets/svg/icon/check";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import localStorage from "@/utils/localStorage/index";
import { INDICATEURS_HUMEUR, INDICATEURS_SOMMEIL } from "@/utils/liste_indicateurs.1";
import { AnimatedHeaderScrollScreen } from "../survey-v2/AnimatedHeaderScrollScreen";
import { DrugsBottomSheet } from "@/components/DrugsBottomSheet";
import { useBottomSheet } from "@/context/BottomSheetContext";
import logEvents from "@/services/logEvents";
import { Typography } from "@/components/Typography";
import Save from "@assets/svg/icon/Save";

type checkListPath = "reminder" | "symptoms" | "profile" | "goals-settings" | "drugs" | "survey" | "data-export-import";
type checkListIds = "reminder" | "indicators" | "profile" | "goals" | "drugs" | "survey" | "data-export-import";

const checklistItems: {
  label: string;
  icon: JSX.Element;
  path?: checkListPath;
  onClick?: () => void;
  id: checkListIds;
  isDone?: boolean;
}[] = [
  {
    label: "Programmer un rappel",
    icon: <Bell />,
    path: "reminder",
    id: "reminder",
    onClick: () => {
      logEvents.logClickCheckList("reminder");
    },
  },
  {
    label: "Personnaliser mon suivi",
    icon: <Analytics />,
    path: "symptoms",
    id: "indicators",
    onClick: () => {
      logEvents.logClickCheckList("follow-up");
    },
  },
  {
    label: "Personnaliser mes objectifs",
    icon: <Goal />,
    path: "goals-settings",
    id: "goals",
    onClick: () => {
      logEvents.logClickCheckList("goals");
    },
  },
  {
    label: "Ajouter un traitement",
    icon: <Health />,
    path: "drugs",
    id: "drugs",
    onClick: () => {
      logEvents.logClickCheckList("treatment");
    },
  },
  {
    label: "Découvrir l’export de mes données",
    icon: <Save />,
    path: "data-export-import",
    id: "data-export-import",
  },
];

export default function CheckListScreen({ navigation, route }) {
  const [checklistItemValues, setChecklistItemValues] = useState<Partial<Record<checkListIds, boolean>>>({});
  const { showBottomSheet, closeBottomSheet } = useBottomSheet();

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const reminder = await isReminderActive();
        const goals = await getGoalsTracked();
        const drugs = await localStorage.getMedicalTreatment();
        const userIndicators = await localStorage.getIndicateurs();
        const dataExportDone = await localStorage.getChecklistDataExportDone?.();
        setChecklistItemValues((prev) => ({
          ...prev,
          reminder,
          indicators: !!userIndicators.filter((ind) => ![INDICATEURS_HUMEUR.uuid, INDICATEURS_SOMMEIL.uuid].includes(ind.uuid) && ind.active).length,
          goals: !!goals.length,
          drugs: !!drugs,
          ["data-export-import"]: !!dataExportDone,
        }));
      })();
    }, [])
  );

  const handleItemPress = (item) => {
    if (item.path === "drugs") {
      showBottomSheet(
        <DrugsBottomSheet
          onClose={async () => {
            const drugs = await localStorage.getMedicalTreatment();
            setChecklistItemValues((prev) => ({
              ...prev,
              drugs: !!drugs,
            }));
            closeBottomSheet();
          }}
        />
      );
      if (item.onClick) {
        item.onClick();
      }
    } else if (item.id === "data-export-import") {
      setChecklistItemValues((prev) => ({
        ...prev,
        ["data-export-import"]: true,
      }));
      localStorage.setChecklistDataExportDone(true);
      navigation.navigate(item.path, {
        previous: "checklist",
      });
      if (item.onClick) {
        item.onClick();
      }
    } else {
      navigation.navigate(item.path, {
        previous: "checklist",
      });
      if (item.onClick) {
        item.onClick();
      }
    }
  };

  return (
    <AnimatedHeaderScrollScreen
      title={"Bien démarrer"}
      smallHeader={true}
      scrollViewBackground={TW_COLORS.GRAY_50}
      handlePrevious={() => {
        navigation.goBack();
      }}
      showBottomButton={false}
      navigation={navigation}
    >
      <View className="bg-gray-50 flex-1 p-4">
        <Typography className={mergeClassNames(typography.textMdRegular, "text-cnam-primary-900 text-left mb-8")}>
          Pour profiter un maximum de Jardin Mental, vous pouvez compléter quelques étapes de personnalisation.
        </Typography>
        {checklistItems.map((item, index) => {
          const isDone = item.isDone || checklistItemValues[item.id];
          return (
            <TouchableOpacity
              key={index}
              disabled={isDone}
              onPress={() => handleItemPress(item)}
              className={mergeClassNames("flex-row items-center p-4 mb-3 bg-white rounded-xl border border-gray-300", isDone ? "bg-success-bg" : "")}
            >
              {/* Left Icon */}
              <View
                className={`rounded-full p-2 border w-8 h-8 items-center justify-center`}
                style={{
                  borderColor: isDone ? TW_COLORS.SUCCESS.TEXT : TW_COLORS.GRAY_800,
                }}
              >
                {React.cloneElement(item.icon, {
                  color: isDone ? TW_COLORS.SUCCESS.TEXT : TW_COLORS.GRAY_800,
                  width: 16,
                  height: 16,
                })}
              </View>

              {/* Text */}
              <Typography
                className={mergeClassNames(
                  `flex-1 ml-4 ${typography.textMdMedium} text-cnam-primary-900`,
                  isDone ? "line-through text-mood-text-4" : ""
                )}
              >
                {item.label}
              </Typography>

              {/* Right Arrow */}
              <View className="text-gray-400">{isDone ? <CheckMarkIcon color={TW_COLORS.SUCCESS.TEXT} /> : <ArrowIcon />}</View>
            </TouchableOpacity>
          );
        })}
      </View>
    </AnimatedHeaderScrollScreen>
  );
}
