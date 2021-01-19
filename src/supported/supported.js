import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../common/colors';
import localStorage from '../utils/localStorage';
import matomo from '../services/matomo';
import Matomo from '../services/matomo/lib';
import {useEffect} from 'react';

const Supported = ({navigation}) => {
  const handleClick = async (value) => {
    //send matomo
    matomo.logSupportedSelect(value);
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
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mon Suivi Psy</Text>
          <Text style={styles.title}>Pour commencer</Text>
        </View>
        <Card
          title="Je suis suivi"
          subtitle="Vous avez téléchargé l’application sur recommandation d’un professionnel qui vous suit."
          color="#F4FCFD"
          handleClick={() => handleClick('YES')}
        />
        <Card
          title="Je ne suis pas suivi"
          subtitle="Vous avez téléchargé l’application dans le cadre d’une démarche personnelle, pour suivre vos symptômes et avoir des informations."
          color="#F4FCFD"
          handleClick={() => handleClick('NO')}
        />
        <Card
          title="Je ne suis pas suivi mais je le souhaite"
          subtitle="Vous avez téléchargé l’application pour être informé, orienté et trouver un contact."
          color="#F4FCFD"
          handleClick={() => handleClick('NOT_YET')}
        />
      </View>
    </SafeAreaView>
  );
};

const Card = ({title, subtitle, handleClick}) => {
  return (
    <TouchableOpacity onPress={handleClick}>
      <View style={[styles.card]}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardSubTitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F4FCFD',
    marginBottom: 30,
    borderRadius: 10,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    minHeight: '20%',
  },
  cardTitle: {
    color: colors.DARK_BLUE,
    fontWeight: '700',
    marginBottom: 10,
  },
  cardSubTitle: {
    color: colors.DARK_BLUE,
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    marginBottom: 30,
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
    justifyContent: 'center',
  },
  content: {
    display: 'flex',
    flex: 1,
  },
});

export default Supported;
