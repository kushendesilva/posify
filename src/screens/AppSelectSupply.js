import React from "react";
import { Text, Card, Icon } from "@ui-kitten/components";
import { View } from "react-native";
import AppColors from "../configs/AppColors";
import Screen from "../components/Screen";

function AppSelectSupply({ navigation, route }) {
  const { user } = route.params;
  return (
    <Screen>
      <Card
        onPress={() => navigation.navigate("SuppliersScreen")}
        style={{
          marginVertical: "2%",
          marginTop: "4%",
          marginHorizontal: "4%",
          padding: "2%",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            style={{ width: 50, height: 50, margin: "5%" }}
            fill={AppColors.primary}
            name="car-outline"
          />
          <Text category="h5" style={{ fontWeight: "bold" }}>
            Suppliers
          </Text>
        </View>
      </Card>
      <Card
        onPress={() =>
          navigation.navigate("AppSupplies", {
            user: user,
          })
        }
        style={{
          marginVertical: "2%",
          marginHorizontal: "4%",
          padding: "2%",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Icon
            style={{ width: 50, height: 50, margin: "5%" }}
            fill={AppColors.primary}
            name="archive-outline"
          />
          <Text category="h5" style={{ fontWeight: "bold" }}>
            Supply Requests
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

export default AppSelectSupply;
