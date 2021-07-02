import React, {useState} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import localStorage from '../../utils/localStorage';
import logEvents from '../../services/logEvents';
import Matomo from '../../services/matomo';
import {useEffect} from 'react';

const Supported = ({navigation}) => {
  const handleClick = async (value) => {
    //send matomo
    logEvents.logSupportedSelect(value);
    Matomo.setUserProperties({
      supported: value,
    });
    //navigate to tabs
    navigation.navigate('tabs');
    //set local storage
    await localStorage.setSupported(value);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Mon Suivi Psy</Text>
          <Text style={styles.title}>Pour commencer</Text>
        </View>
        <Card
          title="Je suis suivi, j’ai téléchargé l’application sur recommandation du professionnel qui me suit"
          color="#F4FCFD"
          handleClick={() => handleClick('YES')}
        />
        <Card
          title="Je suis suivi, j’ai téléchargé l’application de moi-même"
          color="#F4FCFD"
          handleClick={() => handleClick('YES_SOLO')}
        />
        <Card
          title="Je ne suis pas suivi mais je le souhaite"
          color="#F4FCFD"
          handleClick={() => handleClick('NOT_YET')}
        />
        <Card
          title="Je ne suis pas suivi"
          color="#F4FCFD"
          handleClick={() => handleClick('NO')}
        />
        <Card
          title="Je suis professionnel de santé"
          color="#F4FCFD"
          handleClick={() => handleClick('PRO')}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const Card = ({title, handleClick}) => {
  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={[styles.card]}>
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#D2F4F7',
    marginBottom: 20,
    borderRadius: 10,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '10%',
  },
  scrollContainer: {
    paddingBottom: 150,
  },

  cardTitle: {
    color: colors.DARK_BLUE,
    fontWeight: '500',
    // marginBottom: 10,
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    marginBottom: 15,
  },
  title: {
    color: colors.BLUE,
    fontSize: 22,
    paddingBottom: 20,
    fontWeight: '700',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    flex: 1,
    display: 'flex',
    // justifyContent: 'center',
  },
  content: {
    display: 'flex',
    flex: 1,
  },
});

export default Supported;
