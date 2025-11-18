import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Platform,
  SafeAreaView,
  Dimensions,
  View,
  ScrollView,
  Linking,
  TouchableWithoutFeedback,
  Alert,
  useWindowDimensions,
  Text,
  TouchableOpacity,
} from "react-native";
import Modal from "react-native-modal";
import DrawerItem from "./drawer-item";
import LegalItem from "./legal-item";
import localStorage from "../../utils/localStorage";
import { getBadgeNotesVersion } from "../../scenes/news";
import { colors } from "../../utils/colors";
import NeedUpdateContext from "../../context/needUpdate";
import { recommendApp } from "../../utils/share";
import app from "../../../app.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Bell from "@assets/svg/icon/Bell";
import Star from "@assets/svg/icon/Star";
import StickerSquare from "@assets/svg/icon/StickerSquare";
import Share from "@assets/svg/icon/Share";
import Phone from "@assets/svg/icon/Phone";
import MessageTextCircle from "@assets/svg/icon/MessageTextCircle";
import Lock from "@assets/svg/icon/Lock";
import LightBulb from "@assets/svg/icon/LightBulb";
import Download from "@assets/svg/icon/Download";
import NPSManager from "../../services/NPS/NPSManager";
import Gear from "@assets/svg/Gear";
import { SquircleButton, SquircleView } from "expo-squircle-view";
import { mergeClassNames } from "@/utils/className";
import { typography } from "@/utils/typography";
import ChevronIcon from "@assets/svg/icon/chevron";
import MegaphoneIcon from "@assets/svg/icon/MegaphoneIcon";
import { TW_COLORS } from "@/utils/constants";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowRightSvg from "../../../assets/svg/arrow-right.js";
import logEvents from "@/services/logEvents";

export default ({ navigation, visible, onClick }) => {
  const [isVisible, setIsVisible] = useState();
  const updateVisible = useContext(NeedUpdateContext);
  const { height, width } = useWindowDimensions();

  const [devModeCount, setDevModeCount] = useState(1);
  const [isDevMode, setIsDevMode] = useState(false);
  const [npsProIsVisible, setNpsProIsVisible] = useState(true);
  const [badgeNpsProIsVisible, setBadgeNpsProIsVisible] = useState(false);
  const [badgeNotesVersionVisible, setBadgeNotesVersionVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    setIsVisible(visible);
    (async () => {
      const n = await getBadgeNotesVersion();
      setBadgeNotesVersionVisible(n);
      const proNPS = await localStorage.getSupported();
      setNpsProIsVisible(proNPS === "PRO");
      const badgeProNPS = await localStorage.getVisitProNPS();
      setBadgeNpsProIsVisible(!badgeProNPS);
      const devMode = await AsyncStorage.getItem("devMode");
      setIsDevMode(devMode === "true");
    })();
  }, [visible]);

  const handleDevModePress = async () => {
    const newCount = devModeCount + 1;
    setDevModeCount(newCount);
    if (newCount % 5 === 0) {
      await AsyncStorage.setItem("devMode", "true");
      setIsDevMode(true);
      Alert.alert("Dev Mode", "Dev mode activated!");
    }
  };

  return (
    <>
      <Modal
        style={styles.modal}
        isVisible={isVisible}
        onBackdropPress={onClick}
        onSwipeComplete={onClick}
        animationIn="slideInLeft"
        animationOut="slideOutLeft"
        deviceWidth={width}
        deviceHeight={height} // <--- met à jour automatiquement
      >
        <SquircleView cornerSmoothing={100} preserveSmoothing={true} style={[styles.card]}>
          <View className="bg-cnam-primary-800" style={{ width: "100%", height: "100%" }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContainer}
              style={[
                // styles.card,
                {
                  // on android the scrollview is being desactived when you open several time the drawer
                  // apparently it is a bug when having scrollview inside modal
                  // this weird workaround fixes it https://github.com/facebook/react-native/issues/48822#issuecomment-2667011212
                  height: 100,
                },
              ]}
            >
              <View
                className="bg-cnam-primary-800"
                style={{
                  paddingTop: insets.top,
                }}
              >
                <View className="p-4 pb-6 bg-cnam-primary-800 flex-col space-y-4">
                  <Text className={mergeClassNames(typography.displayXsBold, "text-cnam-primary-25 text-left")}>Jardin Mental</Text>
                  <SquircleButton
                    onPress={() => {
                      navigation.navigate("news");
                      onClick();
                    }}
                    className="bg-cnam-primary-900 px-3 py-2 flex-row self-start items-center"
                    cornerSmoothing={100}
                    preserveSmoothing={true}
                    style={{
                      borderRadius: 16,
                    }}
                  >
                    {badgeNotesVersionVisible && (
                      <View style={{ borderWidth: 0.5 }} className="bg-red rounded-full w-3 h-3 mr-1 border-cnam-rouge-100-lighten-80"></View>
                    )}
                    <Text className={mergeClassNames(typography.textMdMedium, "text-cnam-primary-25")}>Nouveautés</Text>
                    <View
                      className="ml-2"
                      style={{
                        top: 1,
                        transform: [{ scaleX: -1 }],
                      }}
                    >
                      <ChevronIcon strokeWidth={2.5} color={TW_COLORS.CNAM_PRIMARY_25} />
                    </View>
                  </SquircleButton>
                </View>
                <TouchableOpacity
                  onPress={async () => {
                    // dismiss the drawer first, IOS cannot display two modals at the same tme
                    onClick();
                    await localStorage.setVisitProNPS(true);
                    setTimeout(() => {
                      // a bit hacky : wait for drawer to dismiss before displaying NPS
                      NPSManager.showNPS();
                    }, 500);
                  }}
                  className="bg-white rounded-t-xl flex-row px-4 py-6 self-center border-gray-300 border-b-0 justify-between items-center relative"
                  style={{ width: "90%" }}
                >
                  <View className="flex-row items-center space-x-4">
                    <View className="border border-[1.5] border-cnam-primary-800 rounded-full w-[32] h-[32] items-center justify-center">
                      <MegaphoneIcon color={TW_COLORS.CNAM_PRIMARY_800} />
                    </View>
                    <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>Donner mon avis</Text>
                  </View>
                  <ArrowRightSvg color={TW_COLORS.GRAY_600} />
                </TouchableOpacity>
              </View>
              <View className="bg-cnam-primary-50">
                <TouchableOpacity
                  onPress={async () => {
                    onClick();
                    Linking.openURL("mailto:jardinmental@fabrique.social.gouv.fr");
                  }}
                  className="bg-white rounded-b-xl flex-row px-4 py-6 self-center border border-gray-300 border-t-0 justify-between items-center"
                  style={{ width: "90%" }}
                >
                  <View
                    className="absolute -top-[1] bg-gray-400 h-[1]"
                    style={{
                      left: "5%",
                      right: "5%",
                    }}
                  ></View>
                  <View className="flex-row items-center space-x-4">
                    <View className="border border-[1.5] border-cnam-primary-800 rounded-full w-[32] h-[32] items-center justify-center">
                      <MessageTextCircle color={TW_COLORS.CNAM_PRIMARY_800} />
                    </View>
                    <Text className={mergeClassNames(typography.textLgSemibold, "text-cnam-primary-950")}>Nous contacter</Text>
                  </View>
                  <ArrowRightSvg color={TW_COLORS.GRAY_600} />
                </TouchableOpacity>
                <View className="mt-6 mb-8">
                  <DrawerItem
                    title="Comment ça marche ?"
                    path="faq"
                    navigation={navigation}
                    onClick={() => {
                      logEvents.logOpenFaq();
                      onClick();
                    }}
                  />
                  <Separator />
                  <DrawerItem
                    title="Qui peut voir mes données ?"
                    onClick={() => {
                      navigation.push("faq-detail", {
                        slug: "confidentialité",
                      });
                      onClick();
                    }}
                  />
                  <Separator />
                  <DrawerItem title="Le comité éditorial et scientifique" path="commity" navigation={navigation} onClick={onClick} />
                  <Separator />
                  <DrawerItem title="Recommander l'app" onClick={recommendApp} navigation={navigation} />
                  <Separator />
                  <DrawerItem
                    style={{
                      backgroundColor: TW_COLORS.CNAM_CYAN_100_LIGHTEN_80,
                    }}
                    title="Contacts utiles 24h/24 - 7J/7"
                    path="support"
                    navigation={navigation}
                    onClick={onClick}
                  />
                  <Separator />
                  {updateVisible ? (
                    <DrawerItem
                      badge
                      title="Mettre à jour"
                      icon={<Bell />}
                      navigation={navigation}
                      onClick={() =>
                        Linking.openURL(
                          Platform.OS === "ios"
                            ? "itms-apps://apps.apple.com/FR/app/id1540061393"
                            : "https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.monsuivipsy"
                        )
                      }
                    />
                  ) : null}
                  {isDevMode && (
                    <>
                      <DrawerItem title="Dev Mode" path="dev-mode" navigation={navigation} onClick={onClick} />
                    </>
                  )}
                </View>
                <LegalItem title="Conditions générales d'utilisation" path="cgu" navigation={navigation} onClick={onClick} />
                <LegalItem title="Politique de confidentialité" path="privacy" navigation={navigation} onClick={onClick} />
                <LegalItem title="Mentions légales" path="legal-mentions" navigation={navigation} onClick={onClick} />
                <TouchableWithoutFeedback onPress={handleDevModePress}>
                  <View style={styles.versionContainer}>
                    <Text style={styles.versionLabel}>
                      {Platform.OS === "ios"
                        ? `${app.expo.version} (${app.expo.ios.buildNumber})`
                        : `${app.expo.version} (${app.expo.android.versionCode})`}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </ScrollView>
          </View>
        </SquircleView>
      </Modal>
    </>
  );
};

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1,
  },
  separator: {
    borderColor: TW_COLORS.CNAM_PRIMARY_500,
    borderTopWidth: 1,
  },
  scrollContainer: {
    paddingBottom: 80,
    backgroundColor: TW_COLORS.CNAM_PRIMARY_50,
  },
  versionContainer: {
    marginTop: 47,
    flex: 1,
    alignItems: "center",
  },
  versionLabel: {
    color: "#ddd",
  },
  buildNumberLabel: {
    color: "#eee",
  },
  card: {
    width: "80%",
    height: "100%",
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    overflow: "hidden",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 30,
    paddingTop: 15,
    color: colors.DARK_BLUE,
  },
});
