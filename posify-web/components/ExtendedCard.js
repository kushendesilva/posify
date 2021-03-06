import React from "react";
import { Text, Card, Icon } from "@ui-kitten/components";
import { View } from "react-native";
import AppColors from "../configs/AppColors";

function ExtendedCard({ title, onPress, icon }) {
  return (
    <Card
      onPress={onPress}
      style={{
        margin: "0.5%",
        marginHorizontal: "5%",
        flex: 1,
        padding: "0.5%",
        paddingVertical: "2%",
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
        <Text status="primary" category="h6" style={{ fontWeight: "bold" }}>
          {title}
        </Text>
      </View>
    </Card>
  );
}

export default ExtendedCard;
