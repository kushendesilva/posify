import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Appbar,
  ToggleButton,
  Portal,
  Dialog,
  Provider,
  Paragraph,
} from "react-native-paper";
import AppColors from "../configs/AppColors";
import { firebase } from "../configs/Database";
import { Icon, Button, Input, Text } from "@ui-kitten/components";
import AppRenderIf from "../configs/AppRenderIf";
import Screen from "../components/Screen";

function AppEditShop({ navigation, route }) {
  const EditIcon = (props) => <Icon {...props} name="edit-2-outline" />;
  const CancelIcon = (props) => <Icon {...props} name="slash-outline" />;
  const SaveIcon = (props) => <Icon {...props} name="save-outline" />;
  const DelIcon = (props) => <Icon {...props} name="trash-2-outline" />;
  const CheckIcon = (props) => (
    <Icon {...props} name="checkmark-circle-outline" />
  );

  const [visible, setVisible] = React.useState(false);

  const showConfirmation = () => setVisible(true);

  const hideConfirmation = () => setVisible(false);

  const { shop } = route.params;
  const [entityText, setEntityText] = useState(shop.name);
  const [value, setValue] = useState(shop.category);

  const entityRef = firebase.firestore().collection("shops").doc(shop.id);

  const onEditButtonPress = () => {
    if (entityText && entityText.length > 0 && value && value.length > 0) {
      const data = {
        name: entityText,
        category: value,
      };
      entityRef
        .set(data)
        .then((_doc) => {
          setEntityText("");
          navigation.goBack();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const onDeleteButtonPress = () => {
    firebase
      .firestore()
      .collection("shops")
      .doc(shop.id)
      .delete()
      .then(
        () => {
          hideConfirmation();
          navigation.goBack();
        },
        function (error) {
          // An error happened.
        }
      );
  };

  const [visibility, setVisibility] = useState(true);

  return (
    <Provider>
      <Screen>
        <Appbar style={{ backgroundColor: AppColors.primary }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Edit Shop Details" subtitle={shop.name} />
        </Appbar>
        <View style={styles.containers}>
          <Input
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="primary"
            placeholder="Shop Name"
            label="Shop Name"
            disabled={visibility}
            onChangeText={(text) => setEntityText(text)}
            value={entityText}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginTop: "2%",
            }}
          >
            <Text category="label">Price Category : </Text>
            <ToggleButton.Row
              onValueChange={(value) => setValue(value)}
              value={value}
            >
              <ToggleButton
                disabled={visibility}
                icon="alpha-a"
                value="a"
              ></ToggleButton>
              <ToggleButton
                disabled={visibility}
                icon="alpha-b"
                value="b"
              ></ToggleButton>
              <ToggleButton
                disabled={visibility}
                icon="alpha-c"
                value="c"
              ></ToggleButton>
            </ToggleButton.Row>
          </View>
          {AppRenderIf(
            visibility,
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: "2%",
              }}
            >
              <Button
                accessoryRight={EditIcon}
                status="warning"
                size="giant"
                onPress={() => {
                  setVisibility(!visibility);
                }}
              >
                Edit
              </Button>

              <Button
                accessoryRight={DelIcon}
                status="danger"
                size="giant"
                onPress={showConfirmation}
              >
                Delete
              </Button>
            </View>
          )}
          {AppRenderIf(
            !visibility,
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: "2%",
              }}
            >
              <Button
                accessoryRight={CancelIcon}
                status="danger"
                size="giant"
                onPress={() => {
                  setVisibility(!visibility);
                }}
              >
                Cancel
              </Button>
              <Button
                accessoryRight={SaveIcon}
                status="success"
                size="giant"
                onPress={() => {
                  onEditButtonPress();
                }}
              >
                Update
              </Button>
            </View>
          )}
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideConfirmation}>
            <Dialog.Title>
              <Text category="h6" style={{ fontWeight: "bold" }}>
                Confirmation
              </Text>
            </Dialog.Title>
            <Dialog.Content>
              <Text category="label">Delete {shop.name} Details.</Text>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
              <Button
                accessoryRight={CancelIcon}
                status="danger"
                onPress={hideConfirmation}
              >
                Cancel
              </Button>
              <Button
                accessoryRight={CheckIcon}
                status="success"
                onPress={() => {
                  onDeleteButtonPress();
                }}
              >
                Confirm
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Screen>
    </Provider>
  );
}

const styles = StyleSheet.create({
  containers: {
    padding: 10,
  },
  ContainerButton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  containerHeading: {
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: AppColors.background,
    padding: "5%",
    shadowColor: AppColors.primaryVariant,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 15,
  },
  containerTop: {
    alignItems: "center",
    marginTop: 5,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "center",
  },
  HeadingFont: {
    fontWeight: "bold",
  },
});

export default AppEditShop;
