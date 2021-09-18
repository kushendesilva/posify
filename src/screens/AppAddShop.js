import React, { useState } from "react";
import { StyleSheet, View, Dimensions, StatusBar } from "react-native";
import { Icon, Button, Input, Text, Layout } from "@ui-kitten/components";
import {
  ToggleButton,
  Dialog,
  Portal,
  Paragraph,
  Provider,
  Snackbar,
} from "react-native-paper";
import { firebase } from "../configs/Database";
import AppColors from "../configs/AppColors";

function AppAddShop(props) {
  const DoneIcon = (props) => (
    <Icon {...props} name="checkmark-circle-2-outline" />
  );
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
        <Layout style={[styles.footer]}>
          <View style={styles.innerFooter}>
            <Input
              style={{ marginHorizontal: "2%", marginVertical: "1%" }}
              size="large"
              status="primary"
              placeholder="Shop Name"
              label="Shop Name"
              onChangeText={(text) => setEntityText(text)}
              value={entityText}
            />

            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
                marginVertical: "5%",
              }}
            >
              <Text category="label">Price Category : </Text>
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
              size="giant"
              status="primary"
              style={{ margin: "2%" }}
              accessoryRight={DoneIcon}
              onPress={showDialog}
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
                    status="success"
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
        </Layout>
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
