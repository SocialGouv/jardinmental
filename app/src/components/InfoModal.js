import React, { useState, useRef, useCallback, createContext, useContext } from "react";
import { View, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import Icon from "./Icon";
import { colors } from "../utils/colors";

const InfoModalContext = createContext();

export const useInfoModal = () => useContext(InfoModalContext);

export const InfoButton = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon icon="Info2Svg" width={25} height={25} color={colors.LIGHT_BLUE} />
    </TouchableOpacity>
  );
};

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

  const show = useCallback((_payload) => {
    setPayload(_payload);
    if (_payload?.onClose) onClose.current = _payload.onClose;
  }, []);

  const hide = useCallback(() => {
    setPayload(null);
  }, []);

  const value = {
    show,
    hide,
  };

  return (
    <InfoModalContext.Provider value={value}>
      {children}

      {payload && (
        <TouchableWithoutFeedback onPress={hide}>
          <View style={styles.container}>
            <View style={styles.contentContainer}>
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
          </View>
        </TouchableWithoutFeedback>
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
    backgroundColor: "#00000055",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    backgroundColor: "#F8FDFE",
    borderColor: "#AEEDF8",
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 10,
    paddingHorizontal: 15,
  },
  text: {
    fontSize: 12,
    fontWeight: "400",
    marginVertical: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 10,
  },
});
