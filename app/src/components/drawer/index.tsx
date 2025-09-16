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
} from "react-native";
import Modal from "react-native-modal";
import DrawerItem from "./drawer-item";
import LegalItem from "./legal-item";
import localStorage from "../../utils/localStorage";
import { getBadgeNotesVersion } from "../../scenes/news";
import Text from "../../components/MyText";
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
import NPS from "../../services/NPS/NPS";
import Gear from "@assets/svg/Gear";

export default ({ navigation, visible, onClick }) => {
  const [isVisible, setIsVisible] = useState();
  const updateVisible = useContext(NeedUpdateContext);
  const { height, width } = useWindowDimensions();

  const [devModeCount, setDevModeCount] = useState(1);
  const [isDevMode, setIsDevMode] = useState(false);
  const [npsProIsVisible, setNpsProIsVisible] = useState(true);
  const [badgeNpsProIsVisible, setBadgeNpsProIsVisible] = useState(false);
  const [badgeNotesVersionVisible, setBadgeNotesVersionVisible] = useState(false);
  const [NPSvisible, setNPSvisible] = useState(false);

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
      <NPS
        forceView={NPSvisible}
        close={() => {
          setNPSvisible(false);
          onClick();
        }}
      />
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
        <SafeAreaView style={[styles.card]}>
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
            <Text style={styles.title}>Jardin Mental</Text>
            <DrawerItem badge={badgeNotesVersionVisible} title="Nouveautés" path="news" navigation={navigation} onClick={onClick} icon={<Star />} />
            <Separator />
            <DrawerItem title="Comment ça marche ?" path="faq" navigation={navigation} onClick={onClick} icon={<StickerSquare />} />
            <DrawerItem title="Recommander Jardin&nbsp;Mental" onClick={recommendApp} navigation={navigation} icon={<Share />} />
            <DrawerItem title="Parler à quelqu'un et s'informer" path="infos" navigation={navigation} onClick={onClick} icon={<Phone />} />
            <DrawerItem title="Nous contacter" path="contact" navigation={navigation} onClick={onClick} icon={<MessageTextCircle />} />
            <DrawerItem title="Qui peut voir mes données ?" path="privacy-light" navigation={navigation} onClick={onClick} icon={<Lock />} />
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
            <DrawerItem
              badge={badgeNpsProIsVisible}
              title="Donner mon avis"
              icon={<LightBulb />}
              navigation={navigation}
              onClick={async () => {
                // dismiss the drawer first, IOS cannot display two modals at the same tme
                setIsVisible(false);
                await localStorage.setVisitProNPS(true);
                setTimeout(() => {
                  // a bit hacky : whai for drawer to dismiss before displaying NPS
                  setNPSvisible(true);
                }, 500);
              }}
            />
            {isDevMode && <DrawerItem title="Dev Mode" path="dev-mode" navigation={navigation} onClick={onClick} icon={<Gear />} />}
            {isDevMode && (
              <DrawerItem
                title="Export / Import mes données"
                path="data-export-import"
                navigation={navigation}
                onClick={onClick}
                icon={<Download />}
              />
            )}
            <Separator />
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
          </ScrollView>
        </SafeAreaView>
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
    borderColor: "#eee",
    borderTopWidth: 1,
    marginHorizontal: 30,
    marginVertical: 15,
  },
  scrollContainer: {
    paddingBottom: 80,
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
    backgroundColor: "#fff",
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    padding: 30,
    paddingTop: 15,
    color: colors.DARK_BLUE,
  },
});
