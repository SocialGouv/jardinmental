import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  Platform,
} from 'react-native';
import Text from '../../components/MyText';
import {colors} from '../../utils/colors';
import Icon from '../../components/Icon';

const Question = ({
  question,
  explanation,
  isLast,
  onChangeUserComment,
  userComment,
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const toggleShowExplanation = async () => {
    setShowExplanation((prev) => !prev);
  };
  const [text, setText] = useState('');
  useEffect(() => {
    setText(userComment || '');
  }, [userComment]);

  return (
    <View style={styles.questionContainer}>
      <TouchableOpacity onPress={toggleShowExplanation}>
        <View style={styles.questionHeaderContainer}>
          <View style={styles.questionHeader}>
            {explanation ? (
              <Icon
                icon="InfoSvg"
                width={25}
                height={25}
                color={colors.LIGHT_BLUE}
                styleContainer={{width: 25, height: 25}}
              />
            ) : (
              <View />
            )}
            <Text style={styles.questionTitle}>{question.label}</Text>
            {/* we put a view here because we'll add a item here later */}
            <View />
          </View>
          {explanation && showExplanation ? (
            <View style={styles.questionInfo}>
              <Text>{explanation}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
      <View style={[styles.answerContainer, !isLast && styles.leftFileAriane]}>
        <TextInput
          multiline={true}
          numberOfLines={Platform.OS === 'ios' ? null : 3}
          minHeight={Platform.OS === 'ios' ? 30 * 3 : null}
          onChangeText={(v) => {
            setText(v);
            onChangeUserComment({key: question.id, userComment: v});
          }}
          value={text}
          placeholder="Ajouter une précision sur ce critère"
          style={styles.textArea}
          textAlignVertical={'top'}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textArea: {
    backgroundColor: '#F4FCFD',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    marginHorizontal: 15,
  },
  questionContainer: {
    display: 'flex',
  },
  questionHeaderContainer: {
    backgroundColor: '#F4FCFD',
    borderColor: '#DEF4F5',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  questionHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  questionInfo: {
    marginTop: 15,
  },
  questionTitle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  answerContainer: {
    paddingTop: 10,
    paddingBottom: 15,
    marginLeft: 18, // padding of the header question container + half of the dot size => 10 + 8 = 18
    display: 'flex',
    justifyContent: 'space-around',
  },
  leftFileAriane: {
    borderLeftColor: '#DEF4F5',
    borderLeftWidth: 2,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
});

export default Question;
