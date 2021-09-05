import React, { useState } from "react";
import { StyleSheet, View, Text, Dimensions, StatusBar } from "react-native";
import {
  Caption,
  ToggleButton,
  Button,
  TextInput,
  Dialog,
  Portal,
  Paragraph,
  Provider,
  Snackbar,
} from "react-native-paper";
import { firebase } from "../configs/Database";

import AppColors from "../configs/AppColors";

function AppAddShop(props) {
  const [visibleSnack, setVisibleSnack] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);

  const onDismissSnackBar = () => setVisibleSnack(false);

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [value, setValue] = useState("");

  const [entityText, setEntityText] = useState("");

  const entityRef = firebase.firestore().collection("shops");

  const onAddButtonPress = () => {
    if (entityText && entityText.length > 0) {
      //const key = Date.now();
      const data = {
        name: entityText,
        category: value,
        //id: key,
      };
      entityRef
        .add(data)
        .then((_doc) => {
          setEntityText("");
          props.navigation.goBack();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />
        <View style={styles.header}>
          <Text style={styles.text}>Add New Shop Details</Text>
        </View>
        <View
          style={[
            styles.footer,
            {
              backgroundColor: AppColors.background,
            },
          ]}
        >
          <View style={styles.innerFooter}>
            <TextInput
              placeholder="Shop Name"
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
              }}
            >
              <Caption style={{ fontSize: 16 }}>Price Category </Caption>
              <ToggleButton.Row
                onValueChange={(value) => setValue(value)}
                value={value}
              >
                <ToggleButton icon="alpha-a" value="a"></ToggleButton>
                <ToggleButton icon="alpha-b" value="b"></ToggleButton>
                <ToggleButton icon="alpha-c" value="c"></ToggleButton>
              </ToggleButton.Row>
            </View>
            <Button
              mode="contained"
              icon="check-circle"
              style={styles.button}
              onPress={showDialog}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
            >
              Submit
            </Button>
            <Portal>
              <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>Notice</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>Confirmation</Paragraph>
                </Dialog.Content>
                <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
                  <Button
                    mode="contained"
                    color={AppColors.red}
                    onPress={hideDialog}
                  >
                    Cancel
                  </Button>
                  <Button
                    mode="contained"
                    color={AppColors.secondaryVariant}
                    onPress={() => {
                      hideDialog();
                      onToggleSnackBar();
                      onAddButtonPress();
                    }}
                  >
                    Confirm
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
            <Snackbar
              visible={visibleSnack}
              onDismiss={onDismissSnackBar}
              action={{
                label: "Okay",
                onPress: () => {
                  onDismissSnackBar();
                  props.navigation.goBack();
                },
              }}
            >
              Successful
            </Snackbar>
          </View>
        </View>
      </View>
    </Provider>
  );
}

export default AppAddShop;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 4,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: "5%",
    justifyContent: "center",
  },
  innerFooter: { padding: "4%", marginTop: "5%" },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  button: {
    padding: "4%",
    marginTop: "5%",
  },
  forget: {
    color: AppColors.primaryVariant,
    fontSize: 16,
    marginTop: "3%",
    alignSelf: "center",
  },
  text: {
    color: AppColors.background,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
