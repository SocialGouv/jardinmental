import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import dayjs from 'dayjs';
import TimePicker from '@/components/timePicker';
import { colors } from '@/utils/colors';
import { OnboardingV2ScreenProps } from '../types';
import CheckInHeader from '@/components/onboarding/CheckInHeader';

type Props = OnboardingV2ScreenProps<'OnboardingReminder'>;

const ReminderScreen: React.FC<Props> = ({
  navigation,
}) => {
  // Initialize default time to 20:00 (8 PM)
  const [selectedTime, setSelectedTime] = useState(() => {
    const defaultTime = new Date();
    defaultTime.setHours(20, 0, 0, 0);
    return defaultTime;
  });
  
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleTimePress = () => {
    setShowTimePicker(true);
  };

  const handleTimeSelected = (time: Date | null) => {
    if (time) {
      setSelectedTime(time);
    }
    setShowTimePicker(false);
  };

  const handleValidate = () => {
    if (navigation) {
      navigation.navigate('day-survey')
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CheckInHeader
          title=""
          onPrevious={() => navigation.goBack()}
          onSkip={() => navigation.goBack()}
          showPrevious={true}
          showSkip={true}
        />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>Trouvez votre rythme</Text>
          
          {/* Description */}
          <Text style={styles.description}>
            Programmer un rappel quotidien peut vous aider à installer une routine bienveillante. 
            Consigner chaque jour votre état permet de découvrir progressivement ce qui vous fait du bien, 
            et ce qui vous freine.
          </Text>
          
          {/* Time Display */}
          <View style={styles.timeContainer}>
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={handleTimePress}
              activeOpacity={0.7}
            >
              <Text style={styles.timeText}>
                {dayjs(selectedTime).format('HH:mm')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Validation Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.validateButton}
            onPress={handleValidate}
            activeOpacity={0.8}
          >
            <Text style={styles.validateButtonText}>
              Valider ce rappel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      {/* TimePicker Modal */}
      <TimePicker
        visible={showTimePicker}
        selectDate={handleTimeSelected}
        value={selectedTime}
        headerTextIOS="Choisir l'heure du rappel"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.BLUE,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 34,
  },
  description: {
    fontSize: 18,
    color: colors.DARK_BLUE,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 50,
    fontWeight: '300',
  },
  timeContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  timeButton: {
    backgroundColor: colors.WHITE,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: colors.LIGHT_BLUE,
  },
  timeText: {
    fontSize: 48,
    fontWeight: '600',
    color: colors.DARK_BLUE,
    textAlign: 'center',
  },
  buttonContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  validateButton: {
    backgroundColor: colors.LIGHT_BLUE,
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    minWidth: 200,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  validateButtonText: {
    color: colors.WHITE,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default ReminderScreen;
