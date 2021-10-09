import React, { useState, useEffect } from "react";
import { View, StatusBar, FlatList, StyleSheet } from "react-native";
import { firebase } from "../configs/Database";
import { Icon, Card, useTheme, Button, Text } from "@ui-kitten/components";
import Screen from "../components/Screen";
import AppRenderIf from "../configs/AppRenderIf";

function AppShop(props) {
  const NewIcon = (props) => <Icon {...props} name="plus-outline" />;

  const theme = useTheme();
  const [users, setUsers] = useState([]);

  const userRef = firebase
    .firestore()
    .collection("users")
    .where("type", "==", "store");

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
    <Screen>
      <StatusBar
        backgroundColor={theme["color-primary-default"]}
        barStyle="light-content"
      />
      <FlatList
        data={users}
        keyExtractor={(employee) => employee.id.toString()}
        renderItem={({ item }) => (
          <Card
            status="primary"
            style={{
              marginVertical: "2%",
              marginHorizontal: "15%",
            }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Icon
                style={{ width: 30, height: 30, margin: "5%" }}
                fill={theme["color-primary-default"]}
                name="shopping-cart-outline"
              />
              <Text category="h6" style={{ fontWeight: "bold" }}>
                {item.fullName}
              </Text>
              <Text category="label" style={{ textTransform: "capitalize" }}>
                Price Category: {item.category}
              </Text>
            </View>
          </Card>
        )}
      />
      <Button
        size="large"
        style={styles.fab}
        status="primary"
        accessoryLeft={NewIcon}
        onPress={() => props.navigation.navigate("AddShopScreen")}
      />
    </Screen>
  );
}

export default AppShop;

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 25,
  },
});
