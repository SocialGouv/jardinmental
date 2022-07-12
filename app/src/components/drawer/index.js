import React, { useState, useEffect, useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Platform,
  Dimensions,
  View,
  ScrollView,
  Linking,
  TouchableWithoutFeedback,
} from "react-native";
import Modal from "react-native-modal";
import DrawerItem from "./drawer-item";
import LegalItem from "./legal-item";
import localStorage from "../../utils/localStorage";
import { getBadgeNotesVersion } from "../../scenes/news";
import pck from "../../../package.json";
import Text from "../../components/MyText";
import { colors } from "../../utils/colors";
import NeedUpdateContext from "../../context/needUpdate";
import { HOST } from "../../config";

export default ({ navigation, visible, onClick }) => {
  const [isVisible, setIsVisible] = useState();
  const updateVisible = useContext(NeedUpdateContext);

  const [devModeCount, setDevModeCount] = useState(0);
  const [npsProIsVisible, setNpsProIsVisible] = useState(true);
  const [badgeNpsProIsVisible, setBadgeNpsProIsVisible] = useState(false);
  const [badgeNotesVersionVisible, setBadgeNotesVersionVisible] = useState(false);

  useEffect(() => {
    setIsVisible(visible);
    (async () => {
      const n = await getBadgeNotesVersion();
      setBadgeNotesVersionVisible(n);
      const proNPS = await localStorage.getSupported();
      setNpsProIsVisible(proNPS === "PRO");
      const badgeProNPS = await localStorage.getVisitProNPS();
      setBadgeNpsProIsVisible(!badgeProNPS);
    })();
  }, [visible]);

  const deviceHeight = Dimensions.get("window").height;
  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackdropPress={onClick}
      onSwipeComplete={onClick}
      animationIn="slideInLeft"
      animationOut="slideOutLeft"
      deviceHeight={deviceHeight}
    >
      <View style={styles.card}>
        <SafeAreaView>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Text style={styles.title}>Mon Suivi Psy</Text>
            <DrawerItem
              badge={badgeNotesVersionVisible}
              title="Nouveautés"
              path="news"
              navigation={navigation}
              onClick={onClick}
              icon="NewsSvg"
            />
            <Separator />
            <DrawerItem
              title="Présentation"
              path="onboarding"
              navigation={navigation}
              onClick={onClick}
              icon="PresentationSvg"
            />
            <DrawerItem
              title="Parler à quelqu'un et s'informer"
              path="infos"
              navigation={navigation}
              onClick={onClick}
              icon="PhoneSvg"
            />
            <DrawerItem
              title="Nous contacter"
              path="contact"
              navigation={navigation}
              onClick={onClick}
              icon="PeopleSvg"
            />
            <DrawerItem
              title="Qui peut voir mes données ?"
              path="privacy-light"
              navigation={navigation}
              onClick={onClick}
              icon="LockSvg"
            />
            {updateVisible ? (
              <DrawerItem
                badge
                title="Mettre à jour"
                icon="NewsSvg"
                onClick={() =>
                  Linking.openURL(
                    Platform.OS === "ios"
                      ? "itms-apps://apps.apple.com/FR/app/id1540061393"
                      : "https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.monsuivipsy"
                  )
                }
              />
            ) : null}
            {npsProIsVisible ? (
              <DrawerItem
                badge={badgeNpsProIsVisible}
                title="Donner mon avis"
                icon="LightBulbSvg"
                path="contribute-pro"
                navigation={navigation}
                onClick={async () => {
                  await localStorage.setVisitProNPS(true);
                  onClick();
                }}
              />
            ) : null}
            <Separator />
            <LegalItem
              title="Conditions générales d'utilisation"
              path="cgu"
              navigation={navigation}
              onClick={onClick}
            />
            <LegalItem
              title="Politique de confidentialité"
              path="privacy"
              navigation={navigation}
              onClick={onClick}
            />
            <LegalItem
              title="Mentions légales"
              path="legal-mentions"
              navigation={navigation}
              onClick={onClick}
            />
            <TouchableWithoutFeedback onPress={() => setDevModeCount((p) => p + 1)}>
              <View style={styles.versionContainer}>
                <Text style={styles.versionLabel}>
                  version {pck.version}
                  <Text style={styles.buildNumberLabel}>+{pck.buildNumber}</Text>
                </Text>
                {devModeCount % 5 === 0 ? <Text style={styles.versionLabel}>{HOST}</Text> : null}
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
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
