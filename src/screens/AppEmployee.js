import React, { useState, useEffect } from "react";
import { View, StatusBar, FlatList, StyleSheet } from "react-native";
import { Avatar, Title, Caption, FAB, Provider } from "react-native-paper";
import { firebase } from "../configs/Database";

import AppColors from "../configs/AppColors";
import AppRenderIf from "../configs/AppRenderIf";

function AppEmployee(props) {
  const [users, setUsers] = useState([]);

  const userRef = firebase.firestore().collection("users");

  useEffect(() => {
    userRef.onSnapshot(
      (querySnapshot) => {
        const newUsers = [];
        querySnapshot.forEach((doc) => {
          const user = doc.data();
          user.id = doc.id;
          newUsers.push(user);
        });
        setUsers(newUsers);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <Provider>
      <View style={styles.screen}>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />
        <FlatList
          data={users}
          keyExtractor={(employee) => employee.id.toString()}
          renderItem={({ item }) => (
            <View>
              {AppRenderIf(
                item.fullName != "Admin",
                <View style={styles.card}>
                  <Avatar.Icon size={50} icon="account" />
                  <Title style={styles.title}>{item.fullName}</Title>
                  <Caption>{item.email}</Caption>
                </View>
              )}
            </View>
          )}
        />
        <FAB
          style={styles.fab}
          icon="plus"
          onPress={() => props.navigation.navigate("AddEmployeeScreen")}
        />
      </View>
    </Provider>
  );
}

export default AppEmployee;

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    elevation: 10,
    backgroundColor: AppColors.background,
    margin: "2%",
    width: "75%",
    alignSelf: "center",
    borderRadius: 10,
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
