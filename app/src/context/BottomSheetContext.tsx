import React, { createContext, useContext, useRef, useState, ReactNode } from "react";
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type BottomSheetContextType = {
  showBottomSheet: (content: ReactNode) => void;
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

  const showBottomSheet = (newContent: ReactNode) => {
    setContent(newContent);
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
          <BottomSheetModal ref={bottomSheetRef} backdropComponent={renderBackdrop} onDismiss={() => setContent(null)} snapPoints={["100%"]}>
            <BottomSheetView>
              <View className="flex-1 bg-white p-4">{content}</View>
            </BottomSheetView>
          </BottomSheetModal>
        </BottomSheetModalProvider>
      </BottomSheetContext.Provider>
    </GestureHandlerRootView>
  );
};
