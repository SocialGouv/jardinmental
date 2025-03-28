import React, {useContext, useState} from 'react';
import {StyleSheet, TextInput, Alert, KeyboardAvoidingView, Platform, View, ScrollView, Keyboard} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as Print from 'expo-print';
import {shareAsync} from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import {formatHtmlTable} from './utils';
import logEvents from '../../services/logEvents';
import {DiaryDataContext} from '../../context/diaryData';
import {DiaryNotesContext} from '../../context/diaryNotes';
import Icon from '../../components/Icon';
import BackButton from '../../components/BackButton';
import Button from '../../components/Button';

const Export = ({navigation}) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [diaryData] = useContext(DiaryDataContext);
  const [diaryNotes] = useContext(DiaryNotesContext);

  const printToFile = async () => {
    try {
      logEvents.logDataExport();
      setIsLoading(true);
      const html = await formatHtmlTable(diaryData, diaryNotes);
      const {uri} = await Print.printToFileAsync({html, margins: {top: 15, right: 15, bottom: 15, left: 15}});

      let pdfName = uri;
      if (name) {
        pdfName = `${uri.slice(0, uri.lastIndexOf('/') + 1)}${name}.pdf`;
        await FileSystem.moveAsync({
          from: uri,
          to: pdfName,
        });
      }

      await shareAsync(pdfName, {UTI: '.pdf', mimeType: 'application/pdf'});
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Alert.alert("Une erreur s'est produite !");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps="handled"
          style={styles.container}
          contentContainerStyle={styles.scrollContainer}
          keyboardDismissMode="on-drag"
          onScrollBeginDrag={Keyboard.dismiss}>
          <BackButton onPress={navigation.goBack} />
          <Icon
            icon="ExportDataSvg"
            color="#d3d3e8"
            styleContainer={{
              marginTop: 0,
              marginBottom: 50,
            }}
            width={80}
            height={80}
          />
          <Text style={styles.title}>Je génère un fichier avec mes données des 30 derniers jours.</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              <Text style={styles.italic}>Optionnel</Text> : je peux donner un nom à mon bilan pour mieux l'identifier
            </Text>
            <TextInput autoCapitalize="none" onChangeText={setName} value={name} placeholder="Ex: Arthur M. décembre 2020, ..." style={styles.inputMail} />
          </View>
          {isLoading ? <Button title="Génération en cours..." disabled /> : <Button title="Générer un fichier" onPress={printToFile} />}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  indication: {
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#888888',
    marginTop: 3,
  },

  icon: {
    margin: '20%',
  },
  container: {
    padding: 20,
  },
  scrollContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom: 40,
  },
  title: {
    width: '80%',
    flexShrink: 0,
    textAlign: 'center',
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: 'bold',
  },
  backButtonContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    marginBottom: '20%',
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
  },
  inputMail: {
    textAlign: 'center',
    backgroundColor: '#F4FCFD',
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: colors.LIGHT_BLUE,
    padding: 10,
  },
  label: {
    marginBottom: 5,
    color: colors.BLUE,
    textAlign: 'center',
  },
  inputContainer: {
    paddingHorizontal: 30,
    display: 'flex',
    alignSelf: 'stretch',
    marginVertical: 30,
  },
  italic: {
    fontStyle: 'italic',
  },
});

export default Export;
