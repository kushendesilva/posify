import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Appbar,
  TextInput,
  ToggleButton,
  Caption,
  Button,
  Portal,
  Dialog,
  Provider,
  Paragraph,
} from "react-native-paper";
import AppColors from "../configs/AppColors";
import { firebase } from "../configs/Database";

import AppRenderIf from "../configs/AppRenderIf";

function AppEditShop({ navigation, route }) {
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
      <View style={styles.screen}>
        <Appbar style={{ backgroundColor: AppColors.primary }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Edit Shop Details" subtitle={shop.name} />
        </Appbar>
        <View style={styles.containers}>
          <TextInput
            disabled={visibility}
            label="Shop Name"
            onChangeText={(text) => setEntityText(text)}
            value={entityText}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            left={<TextInput.Icon name="store" />}
          />
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "row",
              marginTop: "2%",
            }}
          >
            <Caption style={{ fontSize: 16 }}>Price Category </Caption>
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
                color={AppColors.orange}
                mode="contained"
                style={{ padding: "3%" }}
                icon="square-edit-outline"
                onPress={() => {
                  setVisibility(!visibility);
                }}
              >
                Edit
              </Button>
              <Button
                color={AppColors.red}
                style={{ padding: "3%" }}
                mode="contained"
                icon="trash-can-outline"
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
                color={AppColors.red}
                style={{ padding: "3%" }}
                mode="contained"
                icon="block-helper"
                onPress={() => {
                  setVisibility(!visibility);
                }}
              >
                Cancel
              </Button>
              <Button
                color={AppColors.secondaryVariant}
                style={{ padding: "3%" }}
                mode="contained"
                icon="content-save"
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
            <Dialog.Title>Confirmation</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Delete {shop.name} Details.</Paragraph>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
              <Button
                mode="contained"
                color={AppColors.red}
                onPress={hideConfirmation}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                color={AppColors.secondaryVariant}
                onPress={() => {
                  onDeleteButtonPress();
                }}
              >
                Confirm
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
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
