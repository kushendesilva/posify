import React from "react";
import { Layout, useTheme } from "@ui-kitten/components";
import { StatusBar, StyleSheet } from "react-native";

function Screen({ children }) {
  const theme = useTheme();
  return (
    <Layout style={styles.screen}>
      <StatusBar
        backgroundColor={theme["color-primary-default"]}
        barStyle="light-content"
      />
      {children}
    </Layout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});

export default Screen;
