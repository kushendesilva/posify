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

function AppSignUp({ navigation }) {
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
        <Text style={styles.text}>Create A New Account</Text>

        <View style={styles.innerFooter}>
          <ScrollView>
            <Input
              style={{ marginHorizontal: "2%", marginVertical: "1%" }}
              size="large"
              status="primary"
              value={email}
              label="Name"
              placeholder="Your Name"
              onChangeText={(nextValue) => setEmail(nextValue)}
            />
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
              Sign Up
            </Button>

            <Button
              appearance="ghost"
              onPress={() => navigation.navigate("LoginScreen")}
            >
              Login?
            </Button>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

export default AppSignUp;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.12;

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
    flex: 1.5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: "8%",
    paddingHorizontal: "5%",
    justifyContent: "center",
  },
  innerFooter: { padding: "4%" },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  button: {
    padding: "4%",
    marginTop: "5%",
    marginHorizontal: "2%",
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