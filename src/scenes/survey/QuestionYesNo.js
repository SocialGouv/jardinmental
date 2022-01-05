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
import {answersYesNo} from './utils';

const QuestionYesNo = ({
  question,
  explanation,
  onPress,
  selected,
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
        <View style={styles.answersContainer}>
          {answersYesNo.map((answer, i) => {
            const active = selected === answer.score;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  onPress({key: question.id, value: answer.score});
                  if (!answer.score) {
                    // if the user choose no, we clean the text input
                    setText('');
                    onChangeUserComment({key: question.id, userComment: ''});
                  }
                }}>
                <View
                  style={[
                    styles.selectionYesNoContainer,
                    active && styles.activeSelectionContainer,
                  ]}>
                  <Text style={active && styles.activeLabel}>
                    {answer.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        {selected ? (
          <TextInput
            multiline={true}
            numberOfLines={Platform.OS === 'ios' ? null : 1}
            minHeight={Platform.OS === 'ios' ? 30 * 1 : null}
            onChangeText={(value) => {
              setText(value);
              onChangeUserComment({key: question.id, userComment: value});
            }}
            value={text}
            placeholder="Exemple: alcool, cannabis, tabac..."
            style={styles.textArea}
            textAlignVertical={'top'}
            // onFocus={() => setInputFocused(true)}
            // onBlur={() => setInputFocused(false)}
          />
        ) : null}
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
  selectionContainer: {
    padding: 3,
    borderColor: '#DEF4F5',
    borderWidth: 1,
    borderRadius: 10,
  },
  selectionYesNoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderColor: '#DEF4F5',
    borderWidth: 1,
    borderRadius: 99999,
  },
  activeSelectionContainer: {
    backgroundColor: colors.LIGHT_BLUE,
  },
  activeLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  arrowDown: {
    transform: [{rotate: '180deg'}],
  },
  arrowUp: {
    transform: [{rotate: '0deg'}],
  },

  buttonWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingVertical: 20,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,183,200, .09)',
    marginVertical: 10,
    width: '65%',
    alignSelf: 'center',
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
  questionPoint: {
    height: 16,
    width: 16,
    borderRadius: 8,
    backgroundColor: colors.LIGHT_BLUE,
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
  answersContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 15,
  },
  leftFileAriane: {
    borderLeftColor: '#DEF4F5',
    borderLeftWidth: 2,
  },
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  question: {
    color: colors.BLUE,
    fontSize: 22,
    marginBottom: 26,
    fontWeight: '700',
  },
  subtitleTop: {
    flex: 1,
    color: colors.LIGHT_BLUE,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
    textAlign: 'center',
  },
  subtitle: {
    flex: 1,
    color: '#000',
    fontSize: 15,
    marginTop: 15,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  answer: {
    backgroundColor: '#F4FCFD',
    borderColor: '#D4F0F2',
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  answerLabel: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontWeight: '600',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 0,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
    paddingTop: 15,
    paddingBottom: 30,
  },
  ValidationButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  ValidationButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 19,
  },
  textInput: {
    fontSize: 20,
  },
  bottom: {
    justifyContent: 'flex-end',
    marginBottom: 36,
  },
});

export default QuestionYesNo;
