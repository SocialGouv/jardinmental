import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import Text from '../../../components/MyText';
import {colors} from '../../../utils/colors';
import BackButton from '../../../components/BackButton';
import logEvents from '../../../services/logEvents';

const OnboardingDrugsInformation = ({navigation}) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerContainer}>
        <BackButton onPress={navigation.goBack} />
        <Image
          style={styles.image}
          source={require('../../../../assets/imgs/logo2.png')}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.paragraph}>
          <Text style={styles.standardText}>
            Les noms des médicaments et les posologies ne sont donnés qu'à titre
            indicatif pour vous aider dans le suivi de votre traitement
            médicamenteux. Il convient néanmoins de toujours se référer à la
            prescription médicale vous concernant et à votre médecin référent
            pour tout ce qui a trait à votre traitement médicamenteux en
            particulier et à votre suivi en général.
          </Text>
        </View>
        <View style={styles.paragraph}>
          <Text style={styles.standardText}>
            Voir plus d'informations sur les traitements médicamenteux :{' '}
          </Text>
          <TouchableOpacity
            onPress={() => {
              logEvents.logInfoClick('reseau_pic');
              Linking.openURL(
                'http://www.reseau-pic.info/?dest=fiches/nom.php',
              );
            }}>
            <Text style={styles.link}>reseau-pic.com</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    padding: 20,
    fontSize: 18,
    marginVertical: 15,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  image: {
    height: 50,
    width: 50,
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    paddingBottom: 80,
    display: 'flex',
    alignItems: 'center',
  },
  standardText: {
    fontSize: 18,
    color: colors.DARK_BLUE,
    textAlign: 'center',
  },
  link: {
    color: colors.LIGHT_BLUE,
    textDecorationLine: 'underline',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default OnboardingDrugsInformation;
