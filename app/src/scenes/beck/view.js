import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styleBeck from "../../styles/beck";
import Text from "../../components/MyText";
import Button from "../../components/Button";
import Icon from "../../components/Icon";
import BackButton from "../../components/BackButton";
import { colors } from "../../utils/colors";
import { formatDate, displayOnlyHourAndMinute } from "../../utils/date/helpers";
import TextTag from "../../components/TextTag";
import { BeckStepTitles } from "../../utils/constants";
import { DiaryDataContext } from "../../context/diaryData";
import { confirm, deleteBeckfromDiaryData } from "../../utils";
import logEvents from "../../services/logEvents";
import { parseISO, differenceInDays } from "date-fns";

export default ({ navigation, route }) => {
  const [beck, setBeck] = useState({});
  const [beckId, setBeckId] = useState();
  const [diaryData, setDiaryData] = useContext(DiaryDataContext);

  useEffect(() => {
    logEvents.logBeckViewOpen();
  }, []);

  useEffect(() => {
    setBeck(route?.params?.beck);
    setBeckId(route?.params?.beckId);
  }, [route?.params?.beck, route?.params?.beckId]);

  const {
    date,
    time,
    where,
    who,
    what,
    mainEmotion,
    mainEmotionIntensity,
    otherEmotions,
    physicalSensations,
    thoughtsBeforeMainEmotion,
    trustInThoughsThen,
    memories,
    actions,
    consequencesForYou,
    consequencesForRelatives,
    argumentPros,
    argumentCons,
    nuancedThoughts,
    trustInThoughsNow,
    mainEmotionIntensityNuanced,
  } = beck;

  const canEdit = differenceInDays(new Date(), parseISO(date)) <= 30;

  const handleEdit = () => {
    logEvents.logBeckEditClick();
    navigation.navigate("beck", {
      beckId,
      beck,
      redirect: true,
    });
  };

  const handleDelete = () => {
    confirm({
      title: "Êtes-vous sûr de vouloir supprimer cet élément ?",
      onConfirm: () => {
        deleteBeckfromDiaryData({ date, beckId, diaryData, setDiaryData });
        logEvents.logDeleteBeck();
        navigation.goBack();
      },
      cancelText: "Annuler",
      confirmText: "Oui, supprimer",
    });
  };

  const percentage = (x) => x && `${x * 10}%`;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.buttonsContainer}>
        <BackButton onPress={navigation.goBack} />
        <View style={styles.buttonsRightContainer}>
          {canEdit ? (
            <TouchableOpacity onPress={handleEdit}>
              <Icon icon="NotesSvg" color="#58C8D2" width={25} height={25} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={handleDelete}>
            <Icon icon="BinSvg" color="#D10000" width={25} height={25} />
          </TouchableOpacity>
        </View>
      </View>
      {!canEdit && (
        <View className="bg-gray-100 p-3 mx-4 rounded-lg">
          <Text className="text-gray-600 text-center">Les colonnes de Beck ne peuvent être modifiées après 30 jours</Text>
        </View>
      )}
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
        <View style={styles.stepContainer}>
          <Text style={styleBeck.sectionTitle}>{BeckStepTitles[0]}</Text>
          {date && time ? (
            <Text>
              {formatDate(date)} à {displayOnlyHourAndMinute(time)}
            </Text>
          ) : null}
          {who?.length ? (
            <Text>
              Avec <Text style={styles.bold}>{who?.join(", ")}</Text>
            </Text>
          ) : null}
          {where ? <Text>{where}</Text> : null}
          <ItemText title="Description factuelle" value={what} />
          <View style={styleBeck.XSseparator} />
          <Text style={styleBeck.sectionTitle}>{BeckStepTitles[2]}</Text>
          <ItemTag title="Émotion principale" values={mainEmotion} intensity={percentage(mainEmotionIntensity)} />
          <ItemTag title="Autres émotions" values={otherEmotions} />
          <ItemTag title="Sensations" values={physicalSensations} />
          <View style={styleBeck.XSseparator} />
          <Text style={styleBeck.sectionTitle}>{BeckStepTitles[3]}</Text>
          <ItemText title="Pensée immédiate" value={thoughtsBeforeMainEmotion} intensity={percentage(trustInThoughsThen)} />
          <ItemText title="Images et souvenirs" value={memories} />
          <View style={styleBeck.XSseparator} />
          <Text style={styleBeck.sectionTitle}>{BeckStepTitles[4]}</Text>
          <ItemText title="Qu'avez vous fait ?" value={actions} />
          <ItemText title="Conséquences pour vous" value={consequencesForYou} />
          <ItemText title="Conséquences pour votre entourage" value={consequencesForRelatives} />
          <View style={styleBeck.XSseparator} />
          <Text style={styleBeck.sectionTitle}>{BeckStepTitles[5]}</Text>
          <ItemText title="Arguments en faveur de votre pensée" value={argumentPros} />
          <ItemText title="Arguments en défaveur de votre pensée" value={argumentCons} />
          <ItemText title="Pensée plus nuancée/adaptée" value={nuancedThoughts} />
          <ItemText title="Croyance dans la pensée principale" value={thoughtsBeforeMainEmotion} intensity={percentage(trustInThoughsNow)} />
          <ItemTag title="Émotions après coup" values={mainEmotion} intensity={percentage(mainEmotionIntensityNuanced)} />
          <JMButton title="Terminer" onPress={navigation.goBack} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const ItemText = ({ title, value, intensity }) => {
  if (!value) return null;
  return (
    <View style={styles.stepContainer}>
      <Text style={styleBeck.title}>{title}</Text>
      <View style={styles.contentItem}>
        <View style={styles.citation}>
          <Text>{value}</Text>
        </View>
        {intensity && (
          <View style={styleBeck.listContainer}>
            <TextTag value={intensity} color="#D3D7E4" buttonStyle={{ marginBottom: 0 }} />
          </View>
        )}
      </View>
    </View>
  );
};
const ItemTag = ({ title, values, intensity }) => {
  if (!values || !values.length) return null;
  if (!Array.isArray(values)) values = [values];
  return (
    <View style={styles.stepContainer}>
      <Text style={styleBeck.title}>{title}</Text>
      <View style={styles.contentItem}>
        <View style={styles.contentTag}>
          {values?.map((e, i) => (
            <TextTag key={i} value={e} color="#D4F0F2" />
          ))}
        </View>
        {intensity && <TextTag value={intensity} color="#D3D7E4" buttonStyle={{ marginBottom: 0 }} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  contentItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  contentTag: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  citation: {
    borderLeftWidth: 2,
    borderLeftColor: "#ADB4CD7F",
    paddingLeft: 15,
  },
  bold: { fontWeight: "bold" },
  safe: {
    flex: 1,
    backgroundColor: "white",
  },
  stepContainer: { width: "100%" },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonsRightContainer: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 80,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  stepIndicatorContainer: { marginTop: 15, marginBottom: 35 },
  mainDescription: {
    width: "80%",
    marginTop: 15,
  },
  editButtonText: {
    marginTop: 20,
    marginRight: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
    color: colors.BLUE,
  },
});
