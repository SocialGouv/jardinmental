import React, {
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
  forwardRef,
  useImperativeHandle,
} from "react";
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Pressable } from "react-native";
import Icon from "./Icon";
import { colors } from "../utils/colors";
import { BlurView } from "@react-native-community/blur";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useLayout } from "@react-native-community/hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

const InfoModalContext = createContext();

export const useInfoModal = () => useContext(InfoModalContext);

export const InfoButton = forwardRef(({ onPress, containerStyle }, ref) => {
  const subRef = useRef();

  useImperativeHandle(ref, () => {
    return {
      press,
      getPosition,
    };
  });

  const press = async () => {
    const position = await getPosition();
    onPress?.({ position });
  };

  const getPosition = () => {
    return new Promise((resolve) => {
      if (subRef?.current?.measureInWindow) {
        subRef.current.measureInWindow((x, y) => {
          resolve({ x, y });
        });
      } else {
        resolve(undefined);
      }
    });
  };

  return (
    <TouchableOpacity
      ref={subRef}
      onPress={(event) => {
        getPosition().then((position) => {
          onPress?.({ event, position });
        });
      }}
      style={[containerStyle]}
    >
      <Icon
        icon="Info2Svg"
        width={30}
        height={30}
        color={colors.LIGHT_BLUE}
        styleContainer={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
  );
});

export const InfoText = ({ children, style, title, ...props }) => {
  return (
    <Text style={[styles.text, title && styles.title, style]} {...props}>
      {children}
    </Text>
  );
};

export const InfoModalProvider = ({ children }) => {
  const [payload, setPayload] = useState();
  const onClose = useRef();

  const insets = useSafeAreaInsets();
  const { onLayout: onAreaLayout, ...areaLayout } = useLayout();
  const { onLayout: onContentLayout, ...contentLayout } = useLayout();

  const visibleAnim = useSharedValue(0);
  const opacityAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: visibleAnim.value,
    };
  });

  const show = useCallback((_payload) => {
    setPayload(_payload);
    if (_payload?.onClose) onClose.current = _payload.onClose;
    visibleAnim.value = withTiming(1);
  }, []);

  const hide = useCallback(() => {
    onClose?.current?.();
    visibleAnim.value = withTiming(0, undefined, () => {
      runOnJS(setPayload)(null);
    });
  }, []);

  const value = {
    show,
    hide,
  };

  return (
    <InfoModalContext.Provider value={value}>
      {children}

      {payload && (
        <Animated.View style={[styles.container, opacityAnimStyle]}>
          <BlurView
            style={styles.blur}
            blurType="light"
            blurAmount={6}
            reducedTransparencyFallbackColor="white"
          />
          <Pressable onPress={hide} style={{ flex: 1 }} />
          <View
            style={[
              styles.frameArea,
              !payload.position && styles.frameAreaWithoutPosition,
              payload.position && { top: payload.position.y + 25 + 20, bottom: insets.bottom + 10 },
            ]}
            pointerEvents="box-none"
            onLayout={onAreaLayout}
          >
            <View style={[styles.frameContainer, { height: contentLayout.height + 2 }]}>
              <ScrollView bounces={contentLayout.height > areaLayout.height}>
                <View style={[styles.contentContainer]} onLayout={onContentLayout}>
                  {React.isValidElement(payload.content)
                    ? payload.content
                    : payload.content?.map((item, index) => (
                        <View key={"content_" + index}>
                          {React.isValidElement(item)
                            ? item
                            : typeof item === "string" && <InfoText style={item.style}>{item.text}</InfoText>}
                        </View>
                      ))}
                </View>
              </ScrollView>

              <TouchableOpacity onPress={hide} style={[styles.closeButton]}>
                <Icon icon="CrossSvg" width={15} height={15} color="#bec1c8" />
              </TouchableOpacity>
            </View>
          </View>
          {payload.position && (
            <>
              <InfoButton
                onPress={hide}
                containerStyle={{ position: "absolute", left: payload.position.x, top: payload.position.y }}
              />
              <Svg
                style={{
                  position: "absolute",
                  left: payload.position.x - 10,
                  top: payload.position.y + 25 + 4,
                }}
                viewBox="0 0 19.55287 23.547306"
                height="18"
                width="18"
              >
                <Path
                  style="stroke-linecap:round;stroke-linejoin:round"
                  strokeWidth="1.5"
                  stroke="#d1d5db"
                  fill="#fff"
                  d="M 0.50078499,22.970395 19.052127,0.50064545 14.236094,23.046521"
                />
              </Svg>
            </>
          )}
        </Animated.View>
      )}
    </InfoModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    //backgroundColor: "#00000055",
  },
  blur: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  frameArea: {
    position: "absolute",
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
    alignItems: "center",
  },
  frameAreaWithoutPosition: {
    justifyContent: "center",
  },
  frameContainer: {
    backgroundColor: "#FFF",
    borderColor: "#d1d5db",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    maxHeight: "100%",
  },
  contentContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  text: {
    color: "#222",
    fontSize: 12,
    fontWeight: "400",
    marginVertical: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 15,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});
