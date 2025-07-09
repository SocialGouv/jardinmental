import React, { useEffect, useRef, useState } from 'react';
import { Alert, View, TouchableOpacity, StyleSheet, ScrollView, Linking, Text } from 'react-native';
// import { openSettings } from "react-native-permissions";
import dayjs from 'dayjs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import localStorage from '../../utils/localStorage';
import { ONBOARDING_STEPS, TW_COLORS } from '../../utils/constants';
import TimePicker from '../../components/timePicker';
import NotificationService from '../../services/notifications';
import { colors } from '../../utils/colors';
import logEvents from '../../services/logEvents';
import Rappel from '../onboarding/assets/Rappel';
import Button from '../../components/Button';
import { onboardingStyles } from '../onboarding/styles';
import { StickyButtonContainer } from '../onboarding/StickyButton';
import { SafeAreaViewWithOptionalHeader } from '../onboarding/ProgressHeader';
import { OnboardingBackButton } from '../onboarding/BackButton';
import API from '../../services/api';
import * as RNLocalize from 'react-native-localize';
import BeigeWrapperScreen from '../onboarding-v2/BeigeWrapperScreen';
import { mergeClassNames } from '@/utils/className';
import { typography } from '@/utils/typography';
import Pencil from '@assets/svg/Pencil';

const ReminderStorageKey = '@Reminder';

const Reminder = ({ navigation, route, notifReminderTitle = "Comment ça va aujourd'hui ?", notifReminderMessage = "N'oubliez pas de remplir votre application Jardin Mental" }) => {
  const [reminder, setReminder] = useState<dayjs.Dayjs | null>(null);
  const [reminderSetupVisible, setReminderSetupVisible] = useState(false);

  const getReminder = async (showAlert = true) => {
    const isRegistered = await NotificationService.checkPermission();
    let storedReminder = await AsyncStorage.getItem(ReminderStorageKey);
    if (storedReminder) {
      if (!dayjs(storedReminder).isValid()) {
        try {
          storedReminder = JSON.parse(storedReminder);
        } catch (e) { }
      }
    }
    if (Boolean(storedReminder) && !dayjs(storedReminder).isValid()) {
      deleteReminder();
    }
    if (!isRegistered && storedReminder && showAlert) showPermissionsAlert();
    if (!storedReminder) {
      const date = new Date();
      date.setHours(20, 0, 0, 0);
      setReminderRequest(date);
      return;
    }
    const scheduled = await NotificationService.getScheduledLocalNotifications();
    if (!storedReminder) return;
    setReminder(dayjs(storedReminder));
  };

  const handleNotification = notification => {
    if (notification.title === notifReminderTitle) {
      navigation.navigate('tabs');
    }
  };

  const notificationListener = useRef();
  useEffect(() => {
    getReminder(false);
    notificationListener.current = NotificationService.listen(handleNotification, 'reminder');
    localStorage.setOnboardingStep(ONBOARDING_STEPS.STEP_REMINDER);
    // return () => NotificationService.remove(notificationListener.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduleNotification = async (newReminder = new Date(Date.now() + 10 * 1000)) => {
    const fireDate = dayjs().set('hours', newReminder.getHours()).set('minutes', newReminder.getMinutes()).set('seconds', 0).toDate();

    if (!(await NotificationService.hasToken())) return;

    await API.put({
      path: '/reminder',
      body: {
        pushNotifToken: await NotificationService.getToken(),
        type: 'Main',
        timezone: RNLocalize.getTimeZone(),
        timeHours: newReminder.getHours(),
        timeMinutes: newReminder.getMinutes(),
        disabled: false,
      },
    });
    logEvents.logReminderAdd();
  };

  const showReminderSetup = async () => {
    const isRegistered = await NotificationService.checkAndAskForPermission();
    if (!isRegistered) {
      showPermissionsAlert();
      return;
    }
    setReminderSetupVisible(true);
  };

  const showPermissionsAlert = () => {
    Alert.alert(
      'Vous devez autoriser les notifications pour accéder à ce service',
      'Veuillez cliquer sur Réglages puis Notifications pour activer les notifications',
      [
        {
          text: 'Réglages',
          onPress: () => Linking.openSettings(),
        },
        {
          text: 'Annuler',
          onPress: deleteReminder,
          style: 'cancel',
        },
      ],
      { cancelable: true },
    );
  };

  const setReminderRequest = async newReminder => {
    setReminderSetupVisible(false);
    if (!dayjs(newReminder).isValid()) return;
    await scheduleNotification(newReminder);
    setReminder(dayjs(newReminder));
    await AsyncStorage.setItem(ReminderStorageKey, JSON.stringify(dayjs(newReminder)));
    setReminderSetupVisible(false);
    const scheduled = await NotificationService.getScheduledLocalNotifications();
  };

  const deleteReminder = async () => {
    setReminder(null);
    setReminderSetupVisible(false);
    await AsyncStorage.removeItem(ReminderStorageKey);
  };

  const validateOnboarding = async () => {
    // navigation.navigate(ONBOARDING_STEPS.STEP_DRUGS);
    const isRegistered = await NotificationService.checkAndAskForPermission();
    if (!isRegistered) {
      showPermissionsAlert();
      return;
    }
    await localStorage.setOnboardingDone(true);
    // await localStorage.setOnboardingStep(null);
    if (route?.params?.onboarding) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'tabs' }],
      });
    } else {
      navigation.navigate('tabs')
    }
  };

  const desactivateReminder = async () => {
    logEvents.logReminderCancel();
    await deleteReminder();
    if (!(await NotificationService.hasToken())) return;

    await API.put({
      path: '/reminder',
      body: {
        pushNotifToken: await NotificationService.getToken(),
        type: 'Main',
        disabled: true,
      },
    });
    await localStorage.setOnboardingDone(true);
    // await localStorage.setOnboardingStep(null);
    navigation.reset({
      index: 0,
      routes: [{
        name: 'tabs', params: {
          onboarding: true
        }
      }],
    });
  };

  console.log('LCS TOTO REMINDER', reminder)

  return <BeigeWrapperScreen
    variant="blue"
    handlePrevious={navigation.goBack}
    nextText='Programmer mon rappel quotidien'
    handleSkip={() => navigation.navigate('tabs')}
    handleNext={validateOnboarding}
  >
    <View className='flex-1 p-6 z-10 flex justify-center'>
      <Text className={mergeClassNames(typography.displayXsBold, 'text-gray-950 mb-6 text-left')}>Trouvez votre rythme</Text>
      <Text className={mergeClassNames(typography.textMdMedium, 'text-gray-800 text-left mb-6')}>Programmer un rappel quotidien peut vous aider à installer une routine bienveillante.</Text>
      <Text className={mergeClassNames(typography.textMdMedium, 'text-gray-800 text-left mb-6')} > Consigner chaque jour votre état permet de découvrir progressivement ce qui vous fait du bien, et ce qui vous freine.</Text>
      <TouchableOpacity
        onPress={showReminderSetup}
        className='border border-gray-300 rounded-3xl px-10 py-6 items-center justify-center mb-6 bg-white w-auto self-center'>
        <Text className={mergeClassNames(typography.textSmMedium, 'mb-2')}> Recevez un rappel à:</Text>
        <View className='py-3 pt-5 px-8 border-2 border-secondary rounded-3xl w-auto flew-column h-auto'>
          <Text className="font-bold text-5xl text-brand-600">{`${dayjs(reminder).format('HH:mm')}`}</Text>
        </View>
        <View className="flex-row items-center justify-center mt-4">
          <Text className='text-base mr-2 items-center justify-center'>Éditer</Text>
          <Pencil
            color={TW_COLORS.BRAND_700}
            width={16}
            height={16}
          />
        </View>
      </TouchableOpacity>
    </View>
    {/* <ScrollView style={onboardingStyles.scroll} contentContainerStyle={onboardingStyles.scrollContentContainer}>
      <View style={onboardingStyles.container}>
        <View style={onboardingStyles.imageContainer}>
          <Rappel width={100} height={100} />
        </View>
        {reminder ? (
          <>
            <View style={onboardingStyles.containerBottom}>
              <View style={onboardingStyles.containerBottomTitle}>
                <Text style={onboardingStyles.h1}>Programmez un rappel</Text>
              </View>
              <View style={onboardingStyles.containerBottomText}>
                <Text style={onboardingStyles.presentationText}>Plus vous remplirez votre questionnaire, plus vous en apprendrez sur vous et votre santé mentale</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.time}>{`${dayjs(reminder).format('HH:mm')}`}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.subtitle}>Un rappel permet de remplir plus souvent l'application et obtenir des analyses plus pertinentes</Text>
        )}
      </View>
    </ScrollView> */}
    {/* <StickyButtonContainer>
      <Button onPress={validateOnboarding} title="Suivant" />
      <TouchableOpacity style={stylesButton.button} onPress={desactivateReminder}>
        <Text style={stylesButton.text}>Désactiver le rappel</Text>
      </TouchableOpacity>
    </StickyButtonContainer> */}
    <TimePicker visible={reminderSetupVisible} selectDate={setReminderRequest} />
  </BeigeWrapperScreen >
};

// return (
//   <SafeAreaViewWithOptionalHeader style={onboardingStyles.safe}>
//     <View style={onboardingStyles.topContainer}>
//       <OnboardingBackButton onPress={navigation.goBack} />
//     </View>
//     <ScrollView style={onboardingStyles.scroll} contentContainerStyle={onboardingStyles.scrollContentContainer}>
//       <View style={onboardingStyles.container}>
//         <View style={onboardingStyles.imageContainer}>
//           <Rappel width={100} height={100} />
//         </View>
//         {reminder ? (
//           <>
//             <View style={onboardingStyles.containerBottom}>
//               <View style={onboardingStyles.containerBottomTitle}>
//                 <Text style={onboardingStyles.h1}>Programmez un rappel</Text>
//               </View>
//               <View style={onboardingStyles.containerBottomText}>
//                 <Text style={onboardingStyles.presentationText}>Plus vous remplirez votre questionnaire, plus vous en apprendrez sur vous et votre santé mentale</Text>
//               </View>
//             </View>
//             <TouchableOpacity onPress={showReminderSetup}>
//               <Text style={styles.time}>{`${dayjs(reminder).format('HH:mm')}`}</Text>
//             </TouchableOpacity>
//           </>
//         ) : (
//           <Text style={styles.subtitle}>Un rappel permet de remplir plus souvent l'application et obtenir des analyses plus pertinentes</Text>
//         )}
//       </View>
//     </ScrollView>
//     <StickyButtonContainer>
//       <Button onPress={validateOnboarding} title="Suivant" />
//       <TouchableOpacity style={stylesButton.button} onPress={desactivateReminder}>
//         <Text style={stylesButton.text}>Désactiver le rappel</Text>
//       </TouchableOpacity>
//     </StickyButtonContainer>
//     <TimePicker visible={reminderSetupVisible} selectDate={setReminderRequest} />
//   </SafeAreaViewWithOptionalHeader>
// );

const stylesButton = StyleSheet.create({
  buttonWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  button: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    minWidth: '70%',
    minHeight: 45,
    borderRadius: 45,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#1f2937',
  },
});

const styles = StyleSheet.create({
  buttonWrapper: {
    width: '100%',
    display: 'flex',
    alignItems: 'stretch',
    position: 'absolute',
    bottom: 0,
    padding: 20,
  },
  containerSvg: {
    alignItems: 'center',
    marginVertical: 20,
  },
  ctaContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    margin: 30,
  },
  lightBlue: {
    color: colors.LIGHT_BLUE,
  },
  smallImage: {
    color: colors.BLUE,
    height: 40,
    width: 40,
    marginVertical: 0,
    marginRight: 10,
  },
  bigImage: {
    color: '#C3C7D5',
    marginVertical: 0,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  safe: {
    flexGrow: 1,
    backgroundColor: '#f9f9f9',
    display: 'flex',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  bigTitle: {
    width: '80%',
    flexShrink: 0,
    textAlign: 'center',
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: '700',
    marginTop: '10%',
  },
  smallTitle: {
    width: '80%',
    flexShrink: 0,
    textAlign: 'center',
    fontSize: 22,
    color: colors.BLUE,
    fontWeight: '700',
  },
  description: {
    display: 'flex',
    flex: 1,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    color: colors.BLUE,
    fontWeight: '700',
  },
  time: {
    borderColor: colors.DARK_BLUE,
    borderRadius: 20,
    borderWidth: 1,
    color: colors.DARK_BLUE,
    fontWeight: '500',
    fontSize: 35,
    textAlign: 'center',
    paddingVertical: 10,
  },
  buttons: {
    justifyContent: 'space-around',
    marginVertical: 15,
    marginBottom: '20%',
  },
  backButtonContainer: {
    alignSelf: 'flex-start',
    paddingLeft: 20,
    marginBottom: '20%',
    marginTop: 20,
  },
  backButton: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
  },
  later: {
    fontWeight: '700',
    textDecorationLine: 'underline',
    color: colors.BLUE,
  },
  setupButton: {
    backgroundColor: colors.LIGHT_BLUE,
    height: 45,
    borderRadius: 45,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  setupButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  bodyContainer: { flex: 2 },
  body: {
    color: colors.DARK_BLUE,
    fontSize: 15,
    marginVertical: 10,
    fontWeight: '400',
    textAlign: 'left',
  },
  link: {
    color: '#181818',
    textDecorationLine: 'underline',
    fontSize: 14,
    marginBottom: 10,
    fontWeight: '300',
    textAlign: 'center',
  },
  lightblue: {
    color: colors.LIGHT_BLUE,
  },
});

export default Reminder;
