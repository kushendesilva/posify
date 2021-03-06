import React, { useState } from "react";
import { StyleSheet, View, Dimensions, StatusBar } from "react-native";
import { firebase } from "../configs/Database";
import {
  Dialog,
  Portal,
  Paragraph,
  Provider,
  Snackbar,
} from "react-native-paper";
import { Icon, Button, Input, Text, Layout } from "@ui-kitten/components";
import AppColors from "../configs/AppColors";

function AppAddSuppliers(props) {
  const DoneIcon = (props) => (
    <Icon {...props} name="checkmark-circle-2-outline" />
  );

  const [visibleSnack, setVisibleSnack] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);

  const onDismissSnackBar = () => setVisibleSnack(false);

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(email.toLowerCase(), password)
      .then((response) => {
        const uid = response.user.uid;
        //const itemID = response.doc.id;
        const data = {
          id: uid,
          email: email.toLowerCase(),
          fullName,
          type: "supplier",
        };

        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .set(data)
          .then(() => {
            props.navigation.goBack();
          })
          .catch((error) => {
            alert(error);
          });
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <Provider>
      <View style={styles.container}>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />
        <View style={styles.header}>
          <Text style={styles.text}>Add New Supplier Details</Text>
        </View>
        <Layout style={styles.footer}>
          <View style={styles.innerFooter}>
            <Input
              placeholder="Full Name"
              label="Full Name"
              onChangeText={(text) => setFullName(text)}
              value={fullName}
              style={{ marginHorizontal: "2%", marginVertical: "1%" }}
              size="large"
              status="primary"
            />
            <Input
              placeholder="Email"
              label="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
              style={{ marginHorizontal: "2%", marginVertical: "1%" }}
              size="large"
              status="primary"
              autoCapitalize={false}
            />
            <Input
              secureTextEntry
              placeholder="Password"
              label="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              style={{ marginHorizontal: "2%", marginVertical: "1%" }}
              size="large"
              status="primary"
            />
            <Input
              style={{ marginHorizontal: "2%", marginVertical: "1%" }}
              size="large"
              status="primary"
              placeholder="Confirm Password"
              label="Confirm Password"
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              secureTextEntry
            />

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
                  <Button status="danger" onPress={hideDialog}>
                    Cancel
                  </Button>
                  <Button
                    status="success"
                    onPress={() => {
                      hideDialog();
                      onToggleSnackBar();
                      onRegisterPress();
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

export default AppAddSuppliers;

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
