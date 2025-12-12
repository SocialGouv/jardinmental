import React from "react";
import { View, SafeAreaView } from "react-native";

const Background = ({ neverBottom, children, color, withSwiperContainer, debug }) => {
  const Container = withSwiperContainer ? SwiperContainer : React.Fragment;
  const safeAreaProps = neverBottom ? { forceInset: { bottom: "never" } } : {};
  return (
    <>
      <SafeAreaView
        className="h-full"
        style={{
          backgroundColor: color,
          // borderWidth: debug ? 3 : 0,
          // borderWidth: 3,
          // borderColor: 'red',
        }}
      >
        <View
          className={["w-full h-full"].join(" ")}
          style={{
            background: color,
            // borderWidth: debug ? 3 : 0,
            // borderWidth: 3,
            // borderColor: 'blue',
          }}
        >
          <SafeAreaView
            {...safeAreaProps}
            style={{
              backgroundColor: color,
              // borderWidth: 3,
              // borderColor: 'green',
            }}
          >
            <Container>{children}</Container>
          </SafeAreaView>
        </View>
      </SafeAreaView>
    </>
  );
};

const SwiperContainer = ({ children, debug }) => {
  return (
    <View className={["h-full flex-grow flex-shrink-0"].join(" ")} style={{ borderColor: "red", borderWidth: debug ? 3 : 0 }}>
      {children}
    </View>
  );
};

export default Background;
