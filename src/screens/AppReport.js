import React, { useState, useEffect } from "react";
import { View, StatusBar, FlatList, StyleSheet } from "react-native";
import {
  Avatar,
  Title,
  Caption,
  FAB,
  Provider,
  Button,
} from "react-native-paper";
import { firebase } from "../configs/Database";

import AppColors from "../configs/AppColors";

function AppReport(props) {
  const storeRef = firebase
    .firestore()
    .collection("invoices")
    .where("payMethod", "==", "cash")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });

  return (
    <Provider>
      <View style={styles.screen}>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />
        <Title
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 30,
            color: AppColors.primary,
          }}
        >
          Coming Soon!
        </Title>
      </View>
    </Provider>
  );
}

export default AppReport;

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    elevation: 10,
    backgroundColor: AppColors.background,
    margin: "1%",
    borderRadius: 10,
    width: "60%",
    alignSelf: "center",
  },
  title: { fontSize: 16 },
  screen: { flex: 1, justifyContent: "center" },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: AppColors.secondary,
  },
});
