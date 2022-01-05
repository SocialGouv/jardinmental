import React from 'react';
import {StyleSheet, View} from 'react-native';
import Text from '../../components/MyText';

const Toxic = ({data}) => {
  if (!data || !data.value) return null;

  const Detail = ({title, text}) => {
    if (!text) return null;
    return (
      <Text>
        <Text style={styles.boldText}>{title} : </Text>
        <Text style={styles.italic}>{text}</Text>
      </Text>
    );
  };

  return (
    <>
      <View style={styles.divider} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Detail title="Substances" text={data.userComment || 'Oui'} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  textContainer: {width: '100%'},
  boldText: {fontWeight: 'bold'},
  italic: {fontStyle: 'italic'},
  divider: {
    height: 1,
    backgroundColor: '#6BD1F3',
    marginVertical: 10,
    width: '60%',
    alignSelf: 'center',
  },
});

export default Toxic;
