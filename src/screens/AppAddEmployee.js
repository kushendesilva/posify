import React, { useState } from "react";
import { StyleSheet, View, Text, Dimensions, StatusBar } from "react-native";
import { firebase } from "../configs/Database";
import {
  TextInput,
  Button,
  Dialog,
  Portal,
  Paragraph,
  Provider,
  Snackbar,
} from "react-native-paper";
import AppColors from "../configs/AppColors";

function AppAddEmployee(props) {
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
      .createUserWithEmailAndPassword(email, password)
      .then((response) => {
        const uid = response.user.uid;
        //const itemID = response.doc.id;
        const data = {
          id: uid,
          email,
          fullName,
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
          <Text style={styles.text}>Add New Employee Details</Text>
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
              placeholder="Full Name"
              onChangeText={(text) => setFullName(text)}
              value={fullName}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              mode="outlined"
              left={<TextInput.Icon name="account" />}
            />
            <TextInput
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              value={email}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              mode="outlined"
              left={<TextInput.Icon name="email" />}
            />
            <TextInput
              secureTextEntry
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              mode="outlined"
              left={<TextInput.Icon name="lock" />}
            />
            <TextInput
              secureTextEntry
              placeholder="Confirm Password"
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
              underlineColorAndroid="transparent"
              autoCapitalize="none"
              mode="outlined"
              left={<TextInput.Icon name="lock-check" />}
            />

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
        </View>
      </View>
    </Provider>
  );
}

export default AppAddEmployee;

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
