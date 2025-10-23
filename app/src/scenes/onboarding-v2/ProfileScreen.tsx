import React, { useCallback, useRef, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { OnboardingV2ScreenProps, UserProfile } from "./types";
import { NavigationButtons } from "@/components/onboarding/NavigationButtons";
import { useUserProfile } from "@/context/userProfile";
import CheckInHeader from "@/components/onboarding/CheckInHeader";
import QuestionMark from "../../../assets/svg/QuestionMark";
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from "@gorhom/bottom-sheet";
import { TW_COLORS } from "@/utils/constants";
import { SafeAreaViewWithOptionalHeader } from "./ProgressHeader";

type Props = OnboardingV2ScreenProps<"Profile">;

const profiles: UserProfile[] = [
  {
    id: "suivi",
    name: "Oui, je suis suivi(e)",
    selectedDifficulties: [],
    objectives: [],
  },
  {
    id: "non-suivi",
    name: "Non, je ne suis pas suivi(e)",
    selectedDifficulties: [],
    objectives: [],
  },
];

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { setProfile } = useUserProfile();
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);

  const handleNext = () => {
    if (selectedProfile) {
      setProfile(selectedProfile);
      navigation.navigate("Carousel");
    }
  };

  const handlePrevious = () => {
    navigation.goBack();
  };

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderProfileItem = ({ item }: { item: UserProfile }) => (
    <TouchableOpacity
      key={item.id}
      onPress={() => setSelectedProfile(item)}
      className="mx-4 mb-4 p-4 rounded-xl border-2"
      style={{
        borderColor: selectedProfile?.id === item.id ? TW_COLORS.PRIMARY : TW_COLORS.GRAY_LIGHT,
        backgroundColor: selectedProfile?.id === item.id ? TW_COLORS.PRIMARY + "10" : TW_COLORS.WHITE,
      }}
    >
      <View className="flex-row items-center">
        <View className="flex-1">
          <Text className="text-lg font-semibold mb-1" style={{ color: TW_COLORS.TEXT_PRIMARY }}>
            {item.name}
          </Text>
        </View>
        {selectedProfile?.id === item.id && (
          <View className="w-6 h-6 rounded-full items-center justify-center" style={{ backgroundColor: TW_COLORS.PRIMARY }}>
            <Text className="text-white text-xs">✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.5}
        enableTouchThrough={false}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        style={[{ backgroundColor: "rgba(0, 0, 0, 1)" }]}
      />
    ),
    []
  );

  return (
    // <GestureHandlerRootView className='flex-1'>
    <BottomSheetModalProvider>
      <SafeAreaViewWithOptionalHeader className="flex-1 bg-white">
        <CheckInHeader title="" onPrevious={handlePrevious} onSkip={handleNext} showSkip={false} />
        <View className="flex-1 justify-center px-6">
          <Text className="text-2xl font-bold text-center mb-4" style={{ color: TW_COLORS.TEXT_PRIMARY }}>
            Êtes-vous actuellement suivi(e) par un professionnel de la santé mentale ?
          </Text>
          {profiles.map((item) => renderProfileItem({ item }))}
          <Text className="text-base text-center mt-4" style={{ color: TW_COLORS.TEXT_SECONDARY }}>
            Cela nous aide à personnaliser votre expérience
          </Text>
          <View className="items-center mt-2">
            <TouchableOpacity
              onPress={() => bottomSheetRef.current?.present()}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: TW_COLORS.PRIMARY + "20" }}
            >
              <QuestionMark width={20} height={20} color={TW_COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>
        <NavigationButtons onNext={handleNext} onPrevious={handlePrevious} nextDisabled={!selectedProfile} nextText="Continuer" />
        {/* Help Popup */}
        <BottomSheetModal ref={bottomSheetRef} backdropComponent={renderBackdrop} onChange={handleSheetChanges}>
          <BottomSheetView>
            <View className="flex-1 bg-white p-4">
              <Text className="text-lg font-semibold mb-4" style={{ color: TW_COLORS.TEXT_PRIMARY }}>
                Qu’est-ce qu’un professionnel de la santé mentale
              </Text>
              <Text className="text-base mb-4 leading-6" style={{ color: TW_COLORS.TEXT_SECONDARY }}>
                Pas toujours facile de s’y retrouver...
              </Text>
              <Text className="text-base mb-4 leading-6" style={{ color: TW_COLORS.TEXT_SECONDARY }}>
                Un professionnel de la santé mentale peut être un médecin généraliste, psychiatre, un psychologue, un psychothérapeute…
              </Text>
              <Text className="text-base mb-4 leading-6" style={{ color: TW_COLORS.TEXT_SECONDARY }}>
                Si vous hésitez, choisissez ce qui vous semble le plus proche de votre situation.
              </Text>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </SafeAreaViewWithOptionalHeader>
    </BottomSheetModalProvider>
  );
};

export default ProfileScreen;
