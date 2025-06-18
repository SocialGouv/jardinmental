import { useContext } from "react";
import { ContextScreen } from "./ContextScreen";
import { GoalsScreen } from "./GoalsScreen";
import { IndicatorScreen } from "./IndicatorScreen";
import { ToxicScreen } from "./ToxicScreen";
import { EncouragementScreen } from "./EncouragementScreen";
import SurveyContext from "./SurveyContext";

// Screen wrapper component that renders the appropriate screen based on type
const SurveyScreenWrapper: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const context = useContext(SurveyContext);

  if (!context) return null;

  const {
    screens,
    parentRoute
  } = context;

  const { screenData, screenIndex } = route.params;
  const currentStep = screenIndex + 1;
  const totalSteps = screens.length;

  const handleNext = () => {
    if (screenIndex < screens.length - 1) {
      const nextScreen = screens[screenIndex + 1];
      navigation.navigate(`screen-${nextScreen.id}`, {
        screenData: nextScreen,
        screenIndex: screenIndex + 1,
      });
    } else {
      // Final submission
    }
  };

  const screenProps = {
    navigation,
    currentStep,
    totalSteps,
    onNext: handleNext,
  };

  console.log('Screen :', screenData, screenIndex)

  switch (screenData.type) {
    case 'category':
    case 'individual':
      return (
        <IndicatorScreen
          {...screenProps}
          title={screenData.title}
          indicators={screenData.indicators || []}
        />
      );
    case 'goals':
      return (
        <GoalsScreen
          {...screenProps}
          route={parentRoute}
        />
      );
    case 'context':
      return <ContextScreen {...screenProps} />;
    case 'toxic':
      return <ToxicScreen {...screenProps} />;
    case 'encouragement':
      return <EncouragementScreen
        title={screenData.title}
        description={screenData.description}
        extraInfo={screenData.extraInfo}
        {...screenProps} />;
    default:
      return null;
  }
};

export default SurveyScreenWrapper
