import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

export const Card = ({
  title,
  text,
  containerStyle,
  contentContainerStyle,
  innerContentContainerStyle,
  children,
  image,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.contentContainer, contentContainerStyle]}>
        {image && <Image {...image} style={styles.image} />}
        <View style={[styles.innerContentContainer, innerContentContainerStyle]}>
          {title && <Text style={styles.title}>{title}</Text>}
          {text && <Text style={styles.text}>{text}</Text>}
          {children && <View style={styles.childrenContainer}>{children}</View>}
        </View>
      </View>
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
    marginBottom: 4,
    fontFamily: "Karla",
    fontWeight: "700",
    textAlign: "left",
    color: "#26387C",
  },
  text: {
    fontSize: 14,
    marginVertical: 4,
    fontFamily: "Karla",
    fontWeight: "400",
    textAlign: "left",
    color: "#26387C",
  },
  childrenContainer: {
    marginTop: 12,
  },
});
