import { View, Text, Dimensions, Animated, TouchableOpacity } from "react-native";
import { useEffect, useRef, useState } from "react";
import Background from "./Background";
import ChevronIcon from "@assets/svg/icon/chevron";

const CravingBreath = ({ navigation }) => {
  const [breathTime, setBreathTime] = useState(4);
  const [pause, setPause] = useState(1);

  const dimensions = Dimensions.get("window");
  const cirleWidth = dimensions.width / 2;
  const move = useRef(new Animated.Value(0)).current;
  const inhaleOpacity = useRef(new Animated.Value(0)).current;
  const exhaleOpacity = useRef(new Animated.Value(0)).current;
  const holdOpacity = useRef(new Animated.Value(0)).current;
  const [timeOnComponent, setTimeOnComponent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeOnComponent((prevTime) => prevTime + 1);
      if (timeOnComponent >= 89) {
        navigation.goBack();
        // logEvent({
        //   category: "CRAVING",
        //   action: "BREATH_LEAVE",
        //   value: timeOnComponent,
        // });
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeOnComponent]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(exhaleOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(inhaleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(move, {
            toValue: 1,
            duration: breathTime * 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(move, {
            toValue: 1,
            duration: pause * 1000,
            useNativeDriver: true,
          }),
          Animated.timing(holdOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(inhaleOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(holdOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(exhaleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(move, {
            toValue: 0,
            duration: breathTime * 1000,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [breathTime, pause]);
  const translate = move.interpolate({
    inputRange: [0, 1],
    outputRange: [0, cirleWidth / 6],
  });

  return (
    <Background color="white" withSwiperContainer>
      <View className="h-full w-full bg-[#fff] ">
        {/* <BackButton
          content="< Retour"
          bold
          onPress={() => {
            // logEvent({
            //   category: "CRAVING",
            //   action: "BREATH_LEAVE",
            //   value: timeOnComponent,
            // });
            navigation.goBack();
          }}
          marginTop
          marginLeft
        /> */}
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          className="ml-6 flex-row items-center"
        >
          <ChevronIcon />
          <Text className="ml-4 text-cnam-primary-950">Retour</Text>
        </TouchableOpacity>
        <View className="h-full w-screen items-center flex flex-col">
          <Text className="text-primary text-3xl font-bold absolute top-10 pr-2">
            {Math.floor((90 - timeOnComponent) / 60)}:{(90 - timeOnComponent) % 60 < 10 ? "0" : ""}
            {(90 - timeOnComponent) % 60}
          </Text>
          <View className="h-full w-screen items-center flex flex-col justify-center">
            <Animated.View className="justify-center items-center" style={{ opacity: inhaleOpacity }}>
              <Text className="text-cnam-primary-950 text-3xl font-bold absolute">Inspirez</Text>
            </Animated.View>
            <Animated.View className="justify-center items-center" style={{ opacity: exhaleOpacity }}>
              <Text className="text-cnam-primary-950 text-3xl font-bold text-center absolute">Expirez</Text>
            </Animated.View>
            <Animated.View className="justify-center items-center" style={{ opacity: holdOpacity }}>
              <Text className="text-cnam-primary-950 text-3xl font-bold text-center absolute">Maintenez</Text>
            </Animated.View>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => {
              {
                const rotation = move.interpolate({
                  inputRange: [0, 1],
                  outputRange: [`${index * 45}deg`, `${index * 45 + 180}deg`],
                });
                return (
                  <Animated.View
                    key={index}
                    className={"bg-primary rounded-full absolute"}
                    style={{
                      opacity: 0.1,
                      transform: [{ rotateZ: rotation }, { translateX: translate }, { translateY: translate }],
                      width: cirleWidth,
                      height: cirleWidth,
                    }}
                  />
                );
              }
            })}
          </View>
          <View className=" absolute bottom-16 flex-row justify-between w-full px-4">
            <View className="flex-row bg-primary rounded-lg items-center ">
              <TouchableOpacity
                disabled={breathTime === 0}
                className=" p-2"
                onPress={() => {
                  setBreathTime(parseFloat((breathTime - 1).toFixed(1)));
                }}
              >
                <Text className="text-white font-semibold ">-</Text>
              </TouchableOpacity>
              <Text className="text-white font-semibold ">respiration: {breathTime}s</Text>
              <TouchableOpacity
                className="  p-2"
                onPress={() => {
                  setBreathTime(parseFloat((breathTime + 1).toFixed(1)));
                }}
              >
                <Text className="text-white font-semibold">+</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row  bg-primary rounded-lg items-center">
              <TouchableOpacity
                disabled={pause === 0}
                className="  p-2"
                onPress={() => {
                  setPause(parseFloat((pause - 1).toFixed(1)));
                }}
              >
                <Text className="text-white font-semibold">-</Text>
              </TouchableOpacity>
              <Text className="text-white font-semibold ">pause: {pause}s</Text>
              <TouchableOpacity
                className="  p-2"
                onPress={() => {
                  setPause(parseFloat((pause + 1).toFixed(1)));
                }}
              >
                <Text className="text-white  font-semibold">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Background>
  );
};

export default CravingBreath;
