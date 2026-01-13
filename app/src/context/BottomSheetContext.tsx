import React, { createContext, useContext, useRef, useState, ReactNode } from "react";
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { View, StyleSheet, Dimensions } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const screenHeight = Dimensions.get("window").height;
const height90vh = screenHeight * 0.9;

type BottomSheetContextType = {
  showBottomSheet: (content: ReactNode, onClose?: () => void) => void;
  closeBottomSheet: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType>({
  showBottomSheet: () => {},
  closeBottomSheet: () => {},
});

export const useBottomSheet = () => useContext(BottomSheetContext);

export const BottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [content, setContent] = useState<ReactNode>(null);
  const [onCloseCallback, setOnCloseCallback] = useState<(() => void) | null>(null);
  const [isExtended, setIsExtended] = useState(false);

  const showBottomSheet = (newContent: ReactNode, onClose?: () => void) => {
    setContent(newContent);
    setOnCloseCallback(() => onClose || null);
    bottomSheetRef.current?.present();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current?.dismiss();
  };

  const renderBackdrop = (props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetContext.Provider value={{ showBottomSheet, closeBottomSheet }}>
        <BottomSheetModalProvider>
          {children}
          <BottomSheetModal
            // Necessary to work on android with scrollview inside bottomsheetview
            enableContentPanningGesture={false}
            maxDynamicContentSize={height90vh}
            ref={bottomSheetRef}
            backdropComponent={renderBackdrop}
            onChange={(index) => {
              setIsExtended(index === 1);
            }}
            keyboardBehavior="extend"
            enableDynamicSizing={true}
            onDismiss={() => {
              if (onCloseCallback) {
                onCloseCallback();
              }
              setContent(null);
              setOnCloseCallback(null);
            }}
            snapPoints={["90%"]}
          >
            <BottomSheetView>{React.isValidElement(content) ? React.cloneElement(content, { isExtended }) : content}</BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </BottomSheetContext.Provider>
    </GestureHandlerRootView>
  );
};
