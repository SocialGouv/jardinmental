import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Icon from "./Icon";

export const Card = ({
  title,
  text,
  containerStyle,
  contentContainerStyle,
  innerContentContainerStyle,
  icon,
  image,
  onPress,
  children,
}) => {
  const PressableIfNeeded = ({ children }) =>
    onPress ? (
      <TouchableOpacity onPress={onPress} hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}>
        {children}
      </TouchableOpacity>
    ) : (
      <>{children}</>
    );

  return (
    <View style={[styles.container, containerStyle]}>
      <PressableIfNeeded>
        <View style={[styles.contentContainer, contentContainerStyle]}>
          {icon && <Icon width="26" height="26" color="#000091" {...icon} style={styles.image} />}
          {image && <Image {...image} style={styles.image} />}
          <View style={[styles.innerContentContainer, innerContentContainerStyle]}>
            {title && <Text style={styles.title}>{title}</Text>}
            {text && <Text style={styles.text}>{text}</Text>}
            {children && <View style={styles.childrenContainer}>{children}</View>}
          </View>
          {onPress && <Icon icon="ChevronRightSvg" color="#000091" height="16" width="16" />}
        </View>
      </PressableIfNeeded>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "rgba(31, 198, 213, 0.2)",
    borderColor: "rgba(31, 198, 213, 0.2)",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  contentContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    maxHeight: 40,
    maxWidth: 40,
    marginRight: 16,
  },
  innerContentContainer: {
    flexShrink: 1,
    flexGrow: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    fontFamily: "Karla",
    fontWeight: "700",
    textAlign: "left",
    color: "#26387C",
  },
  text: {
    fontSize: 14,
    marginVertical: 2,
    fontFamily: "Karla",
    fontWeight: "400",
    textAlign: "left",
    color: "#26387C",
  },
  childrenContainer: {
    marginTop: 14,
  },
});
