import {StyleSheet} from 'react-native';
import {colors} from '../utils/colors';

export default StyleSheet.create({
  sectionTitle: {
    color: colors.DARK_BLUE,
    fontSize: 22,
    fontWeight: '700',
    marginVertical: 10,
  },
  draft: {color: 'lightgrey'},
  title: {
    color: colors.DARK_BLUE,
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 10,
  },
  submitButton: {alignSelf: 'flex-start', minWidth: 0, marginTop: 30},
  listContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  separator: {marginVertical: 30},
  XSseparator: {marginVertical: 15},
  textArea: {
    borderColor: '#D4F0F2',
    borderWidth: 1,
    backgroundColor: '#F4FCFD',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    padding: 15,
  },
  underlinedBlueText: {
    marginVertical: 15,
    marginRight: 20,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: colors.BLUE,
  },
  required: {
    color: 'red',
    fontSize: 16,
    fontWeight: '600',
  },
});
