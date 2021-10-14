import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Appbar, Portal, Dialog, Provider } from "react-native-paper";
import AppColors from "../configs/AppColors";
import { firebase } from "../configs/Database";
import Screen from "../components/Screen";
import AppRenderIf from "../configs/AppRenderIf";
import { Icon, Button, Input, Text } from "@ui-kitten/components";

function AppBanner({ navigation, route }) {
  const EditIcon = (props) => <Icon {...props} name="edit-2-outline" />;
  const CancelIcon = (props) => <Icon {...props} name="slash-outline" />;
  const SaveIcon = (props) => <Icon {...props} name="save-outline" />;
  const DelIcon = (props) => <Icon {...props} name="trash-2-outline" />;
  const CheckIcon = (props) => (
    <Icon {...props} name="checkmark-circle-outline" />
  );

  const { banner } = route.params;

  const [title, setTitle] = React.useState(banner.title);
  const [content, setContent] = React.useState(banner.content);

  const [visible, setVisible] = React.useState(false);

  const showConfirmation = () => setVisible(true);

  const hideConfirmation = () => setVisible(false);

  const bannerRef = firebase
    .firestore()
    .collection("banners")
    .doc(banner.bannerID);

  const onEditButtonPress = () => {
    const data = {
      title,
      content,
    };
    bannerRef
      .update(data)
      .then((_doc) => {
        setTitle("");
        navigation.goBack();
      })
      .catch((error) => {
        alert(error);
      });
  };

  const onDeleteButtonPress = () => {
    firebase
      .firestore()
      .collection("banners")
      .doc(banner.bannerID)
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
          <Appbar.Content title="Edit Banner" subtitle={banner.title} />
        </Appbar>
        <View style={styles.containers}>
          <Input
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="primary"
            value={title}
            label="Title"
            placeholder="Enter Banner Title"
            onChangeText={(text) => setTitle(text)}
          />
          <Input
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="primary"
            value={content}
            label="Content"
            placeholder="Enter Banner Content"
            onChangeText={(text) => setContent(text)}
            multiline={true}
            textStyle={{ minHeight: 64 }}
          />
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
                onPress={onEditButtonPress}
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
              <Text category="label">
                Remove the Banner titled "{banner.title}"?
              </Text>
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

export default AppBanner;
