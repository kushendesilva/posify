import React from "react";
import { Layout, useTheme } from "@ui-kitten/components";
import { StatusBar } from "react-native";

function Screen({ children }) {
  const theme = useTheme();
  return (
    <Layout style={{ flex: 1 }}>
      <StatusBar
        backgroundColor={theme["color-primary-default"]}
        barStyle="light-content"
      />
      {children}
    </Layout>
  );
}

export default Screen;
