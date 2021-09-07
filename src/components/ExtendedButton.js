import React from "react";
import { Button, Text, Card, Icon } from "@ui-kitten/components";
import { View } from "react-native";

function ExtendedButton({ tabIcon, title, onPress, style }) {
  const ArrowIcon = (props) => (
    <Icon {...props} name="arrow-ios-forward-outline" />
  );
  return (
    <Card onPress={onPress} style={{ margin: "2%" }}>
      <View>
        <View
          style={
            (style,
            {
              flexDirection: "row",
              justifyContent: "space-between",
            })
          }
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Button
              onPress={onPress}
              accessoryRight={tabIcon}
              status="primary"
              appearance="ghost"
            />
            <Text category="h6" style={{ fontWeight: "bold" }}>
              {title}
            </Text>
          </View>
          <Button
            onPress={onPress}
            accessoryRight={ArrowIcon}
            status="primary"
            appearance="ghost"
          />
        </View>
      </View>
    </Card>
  );
}

export default ExtendedButton;
