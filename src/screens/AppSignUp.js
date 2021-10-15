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
import { ToggleButton } from "react-native-paper";
import { Icon, Button, Input, Text } from "@ui-kitten/components";
import AppColors from "../configs/AppColors";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";

function AppSignUp({ navigation }) {
  const LoginIcon = (props) => (
    <Icon {...props} name="checkmark-circle-outline" />
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [type, setType] = useState(null);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props) => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableWithoutFeedback>
  );

  const onRegisterPress = () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
      return;
    }
    if (type == null) {
      alert("Select An Account Type.");
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
          type,
        };

        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .set(data)
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
      <StatusBar
        backgroundColor={AppColors.background}
        barStyle="dark-content"
      />
      <View style={styles.header}>
        <Image
          source={require("../assets/icon.png")}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>
      <View
        style={[
          styles.footer,
          {
            backgroundColor: AppColors.primary,
          },
        ]}
      >
        <Text style={styles.text}>Create A New Account</Text>

        <View style={styles.innerFooter}>
          <ScrollView>
            <Input
              style={{ marginHorizontal: "2%", marginVertical: "1%" }}
              size="large"
              status="control"
              value={fullName}
              label="Name"
              placeholder="Enter Your Name"
              onChangeText={(nextValue) => setFullName(nextValue)}
            />
            <Input
              style={{ marginHorizontal: "2%", marginVertical: "1%" }}
              size="large"
              status="control"
              value={email}
              label="Email"
              placeholder="Enter Your Email"
              onChangeText={(nextValue) => setEmail(nextValue)}
            />

            <Input
              style={{ marginHorizontal: "2%", marginVertical: "1%" }}
              size="large"
              status="control"
              value={password}
              label="Password"
              placeholder="Enter A New Password"
              accessoryRight={renderIcon}
              secureTextEntry={secureTextEntry}
              onChangeText={(nextValue) => setPassword(nextValue)}
            />
            <Input
              style={{ marginHorizontal: "2%", marginVertical: "1%" }}
              size="large"
              status="control"
              value={confirmPassword}
              label="Confirm Password"
              placeholder="Confirm Password"
              accessoryRight={renderIcon}
              secureTextEntry={secureTextEntry}
              onChangeText={(nextValue) => setConfirmPassword(nextValue)}
            />
            <View
              style={{
                margin: "2%",
              }}
            >
              <Text
                style={{
                  textTransform: "capitalize",
                  textAlign: "left",
                  marginBottom: "1%",
                }}
                appearance="alternative"
                category="label"
              >
                Account Type
              </Text>
              <View
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexDirection: "row",
                  backgroundColor: "#648afe",
                  borderRadius: 5,
                  padding: "2%",
                  borderWidth: 0.3,
                  borderColor: AppColors.background,
                }}
              >
                {AppRenderIf(
                  type != null,
                  <>
                    <Text
                      style={{ textTransform: "capitalize", marginLeft: "3%" }}
                      appearance="alternative"
                      category="p1"
                    >
                      {type}
                    </Text>

                    <ToggleButton.Row
                      onValueChange={(value) => setType(value)}
                      value={type}
                      style={{ marginRight: "3%" }}
                    >
                      {AppRenderIf(
                        type == "store",
                        <ToggleButton
                          style={{ backgroundColor: AppColors.primary }}
                          color={AppColors.background}
                          icon="cart-outline"
                          value="store"
                        />
                      )}
                      {AppRenderIf(
                        type == "supplier",
                        <ToggleButton
                          style={{ backgroundColor: AppColors.background }}
                          color={AppColors.primary}
                          icon="cart-outline"
                          value="store"
                        />
                      )}
                      {AppRenderIf(
                        type == "store",
                        <ToggleButton
                          style={{ backgroundColor: AppColors.background }}
                          color={AppColors.primary}
                          icon="truck-outline"
                          value="supplier"
                        />
                      )}
                      {AppRenderIf(
                        type == "supplier",
                        <ToggleButton
                          style={{ backgroundColor: AppColors.primary }}
                          color={AppColors.background}
                          icon="truck-outline"
                          value="supplier"
                        />
                      )}
                    </ToggleButton.Row>
                  </>
                )}
                {AppRenderIf(
                  type == null,
                  <>
                    <Text
                      style={{ marginLeft: "3%" }}
                      appearance="alternative"
                      category="p1"
                    >
                      Select an Account Type
                    </Text>

                    <ToggleButton.Row
                      onValueChange={(value) => setType(value)}
                      value={type}
                      style={{ marginRight: "3%" }}
                    >
                      <ToggleButton
                        style={{ backgroundColor: AppColors.background }}
                        color={AppColors.primary}
                        icon="cart-outline"
                        value="store"
                      />
                      <ToggleButton
                        style={{ backgroundColor: AppColors.background }}
                        color={AppColors.primary}
                        icon="truck-outline"
                        value="supplier"
                      />
                    </ToggleButton.Row>
                  </>
                )}
              </View>
            </View>
            <Button
              status="control"
              accessoryRight={LoginIcon}
              style={styles.button}
              onPress={() => onRegisterPress()}
              size="large"
            >
              Sign Up
            </Button>

            <Button
              status="control"
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
const height_logo = height * 0.1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 3.5,
    backgroundColor: AppColors.primary,
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
    margin: "2%",
    marginTop: "5%",
  },
  text: {
    color: AppColors.background,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
  },
  backdrop: {
    backgroundColor: AppColors.primary,
  },
});
