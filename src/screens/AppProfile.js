import React, { useState } from "react";
import { View, TouchableNativeFeedback, FlatList } from "react-native";
import { Input, Button, Icon } from "@ui-kitten/components";
import AppRenderIf from "../configs/AppRenderIf";
import Screen from "../components/Screen";
import { firebase } from "../configs/Database";

function AppProfile(props) {
  const { user } = props.route.params;

  const userRef = firebase.firestore().collection("users").doc(user.id);

  const onEditButtonPress = () => {
    if (
      (name && name.length > 0 && email && email.length > 0) ||
      (password && password.length > 0)
    ) {
      const data = {
        fullName: name,
        email: email,
        id: user.id,
      };
      userRef
        .set(data)
        .then((_doc) => {
          setPassword("");
          setVisibility(!visibility);
          props.navigation.goBack();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const [name, setName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [visibility, setVisibility] = useState(true);

  const [secureTextEntry, setSecureTextEntry] = React.useState(true);

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const renderIcon = (props) => (
    <TouchableNativeFeedback onPress={toggleSecureEntry}>
      <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
    </TouchableNativeFeedback>
  );
  const EditIcon = (props) => <Icon {...props} name="edit-2-outline" />;
  const CancelIcon = (props) => <Icon {...props} name="slash-outline" />;
  const SaveIcon = (props) => <Icon {...props} name="save-outline" />;

  return (
    <Screen>
      <View style={{ padding: 10 }}>
        <Input
          style={{ marginHorizontal: "2%", marginVertical: "1%" }}
          size="large"
          status="primary"
          value={name}
          label="Name"
          placeholder="Change Your Name"
          onChangeText={(nextValue) => setName(nextValue)}
          disabled={visibility}
        />
        <Input
          style={{ marginHorizontal: "2%", marginVertical: "1%" }}
          size="large"
          status="primary"
          value={email}
          label="Email"
          placeholder="Change Your Email"
          onChangeText={(nextValue) => setEmail(nextValue)}
          disabled={true}
        />
        <Input
          style={{ marginHorizontal: "2%", marginVertical: "1%" }}
          size="large"
          status="primary"
          value={password}
          label="Password"
          accessoryRight={renderIcon}
          secureTextEntry={secureTextEntry}
          placeholder="Enter Your New Password"
          onChangeText={(nextValue) => setPassword(nextValue)}
          disabled={true}
        />

        {AppRenderIf(
          visibility,
          <Button
            accessoryRight={EditIcon}
            style={{ alignSelf: "center", marginTop: "2%" }}
            status="warning"
            size="giant"
            onPress={() => {
              setVisibility(!visibility);
            }}
          >
            Change
          </Button>
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
    </Screen>
  );
}

export default AppProfile;
