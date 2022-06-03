import React from 'react';
import {StyleSheet, View} from 'react-native';
import DiarySymptom from './DiarySymptom';

const DiarySymptoms = ({values, date}) => {
  if (!values || !values?.length) return null;

  return (
    <View style={styles.container}>
      {values?.map(
        (userComment) =>
          userComment && (
            <DiarySymptom
              key={userComment.id}
              userComment={userComment}
              date={date}
            />
          ),
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingVertical: 10,
    marginLeft: 10,
    borderLeftWidth: 0.4,
    borderColor: '#00CEF7',
  },
});

export default DiarySymptoms;
