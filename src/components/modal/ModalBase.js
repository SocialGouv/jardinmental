import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import Modal from "react-native-modal";

const ModalBase = ({ visible, onClick, onModalHide, onBackdropPress, onSwipeComplete, renderContent }) => {
  const [isVisible, setIsVisible] = React.useState();

  React.useEffect(() => {
    // console.log("✍️ ~ visible", visible);
    setIsVisible(visible);
  }, [visible]);

  return (
    <Modal
      style={styles.modal}
      isVisible={isVisible}
      onBackdropPress={() => {
        onBackdropPress?.();
        setIsVisible(false);
      }}
      onSwipeComplete={() => {
        onSwipeComplete?.();
        setIsVisible(false);
      }}
      onModalHide={onModalHide}
      deviceHeight={Dimensions.get("window").height}
    >
      <View style={styles.card}>{renderContent}</View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
});

export default ModalBase;
