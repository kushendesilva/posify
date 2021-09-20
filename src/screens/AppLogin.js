import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { Icon, Button, Input, Modal, Card, Text } from "@ui-kitten/components";
import AppColors from "../configs/AppColors";
import { firebase } from "../configs/Database";

function AppLogin(props) {
  const LoginIcon = (props) => <Icon {...props} name="chevron-right-outline" />;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  const [forgetEmail, setForgetEmail] = useState("");

  const [visible, setVisible] = React.useState(false);
  const showPopUp = () => setVisible(true);
  const hidePopUp = () => setVisible(false);

  const [snackVisible, setSnackVisible] = React.useState(false);
  const onToggleSnackBar = () => setSnackVisible(!snackVisible);
  const onDismissSnackBar = () => setSnackVisible(false);

  const onForgetPress = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(forgetEmail.toLowerCase())
      .then((response) => {
        hidePopUp();
        onToggleSnackBar();
      });
  };

  const onLoginPress = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email.toLowerCase(), password)
      .then((response) => {
        const uid = response.user.uid;
        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .get()
          .then((firestoreDocument) => {
            if (!firestoreDocument.exists) {
              alert("User does not exist anymore.");
              return;
            }
            const user = firestoreDocument.data();
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
    <View style={styles.container}>
      <StatusBar backgroundColor={AppColors.primary} barStyle="light-content" />
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>
      <View
        style={[
          styles.footer,
          {
            backgroundColor: AppColors.background,
          },
        ]}
      >
        <Text style={styles.text}>Welcome to Posify!</Text>

        <View style={styles.innerFooter}>
          <ScrollView>
            <Input
              style={{ marginHorizontal: "2%", marginVertical: "1%" }}
              size="large"
              status="primary"
              value={email}
              label="Email"
              placeholder="Your Email"
              onChangeText={(nextValue) => setEmail(nextValue)}
            />
            <Input
              style={{ marginHorizontal: "2%", marginVertical: "1%" }}
              size="large"
              status="primary"
              value={password}
              label="Password"
              placeholder="Your Password"
              accessoryRight={renderIcon}
              secureTextEntry={secureTextEntry}
              onChangeText={(nextValue) => setPassword(nextValue)}
            />

            <Button
              status="primary"
              accessoryRight={LoginIcon}
              style={styles.button}
              onPress={() => onLoginPress()}
              size="large"
            >
              Login
            </Button>
            <Button appearance="ghost" onPress={showPopUp}>
              Forgot Password?
            </Button>
          </ScrollView>
        </View>
      </View>
      <Snackbar
        duration={500}
        visible={snackVisible}
        onDismiss={onDismissSnackBar}
      >
        Email Sent.
      </Snackbar>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true}>
          <Text
            status="primary"
            style={{
              textAlign: "center",
              margin: "5%",
              paddingHorizontal: "15%",
              fontWeight: "bold",
            }}
            category="h6"
          >
            Forgot Password?
          </Text>
          <Input
            style={{ margin: "5%" }}
            size="large"
            status="primary"
            value={forgetEmail}
            placeholder="Your Email"
            onChangeText={(nextValue) => setForgetEmail(nextValue)}
          />
          <Button
            size="large"
            style={{ margin: "5%" }}
            onPress={() => {
              onForgetPress();
            }}
          >
            Send Email
          </Button>
        </Card>
      </Modal>
    </View>
  );
}

export default AppLogin;

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
    flex: 1.25,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: "8%",
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
  text: {
    color: AppColors.primary,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
  },
  backdrop: {
    backgroundColor: AppColors.background,
  },
});
