import React from "react";
import { Text, Card, Icon } from "@ui-kitten/components";
import { View } from "react-native";
import AppColors from "../configs/AppColors";

function ExtendedCard({ title, onPress, icon }) {
  return (
    <Card
      onPress={onPress}
      style={{
        margin: "2%",
        flex: 1,
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
          style={{ width: 30, height: 30, margin: "5%" }}
          fill={AppColors.primary}
          name={icon}
        />
        <Text category="h6" style={{ fontWeight: "bold" }}>
          {title}
        </Text>
      </View>
    </Card>
  );
}

export default ExtendedCard;
