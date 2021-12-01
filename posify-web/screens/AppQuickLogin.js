import React, { useCallback } from "react";
import {
  Icon,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
  Text,
  Button,
  Card,
  Modal,
} from "@ui-kitten/components";
import {
  StyleSheet,
  BackHandler,
  Image,
  Dimensions,
  StatusBar,
  View,
  Linking,
} from "react-native";
import { firebase } from "../configs/Database";
import AppColors from "../configs/AppColors";

function AppQuickLogin({ navigation }) {
  const { height } = Dimensions.get("screen");
  const height_logo = height * 0.08;

  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const usersRef = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            setLoading(false);
            setUser(userData);
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  const MenuIcon = (props) => (
    <Icon {...props} name="more-vertical" fill={AppColors.background} />
  );
  const InfoIcon = (props) => <Icon {...props} name="info" />;
  const LogoutIcon = (props) => <Icon {...props} name="log-out" />;
  const CheckIcon = (props) => (
    <Icon {...props} name="checkmark-circle-outline" />
  );
  const ContinueIcon = (props) => (
    <Icon {...props} name="chevron-right-outline" />
  );

  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const closeApp = useCallback(async () => {
    await Linking.openURL("https://posify-web.web.app/");
  }, []);

  const [menuVisible, setMenuVisible] = React.useState(false);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const renderMenuAction = () => (
    <TopNavigationAction icon={MenuIcon} onPress={toggleMenu} />
  );

  const renderRightActions = () => (
    <React.Fragment>
      <OverflowMenu
        anchor={renderMenuAction}
        visible={menuVisible}
        onBackdropPress={toggleMenu}
      >
        <MenuItem
          accessoryLeft={InfoIcon}
          title="About"
          onPress={() => {
            navigation.navigate("AppHelp");
            toggleMenu();
          }}
        />
        <MenuItem
          accessoryLeft={LogoutIcon}
          title="Logout"
          onPress={() => {
            firebase
              .auth()
              .signOut()
              .then(
                () => {
                  toggleMenu();
                  showDialog();
                },
                function (error) {
                  // An error happened.
                }
              );
          }}
        />
      </OverflowMenu>
    </React.Fragment>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={AppColors.primary} barStyle="light-content" />
      <TopNavigation
        style={{ backgroundColor: AppColors.primary }}
        alignment="center"
        accessoryRight={renderRightActions}
      />
      <View style={styles.header}>
        <Image
          source={require("../assets/logo.png")}
          style={{
            width: height_logo,
            height: height_logo,
            alignSelf: "center",
            margin: "2%",
          }}
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
        <Text style={styles.text}>
          Use the Mobile Application for Better Experience
        </Text>
        <Button
          status="primary"
          accessoryRight={ContinueIcon}
          onPress={() =>
            navigation.navigate("AppHome", {
              user: user,
            })
          }
          style={{ padding: "4%", width: "30%", marginTop: "3%" }}
          size="large"
        >
          Proceed to Web Application
        </Button>
      </View>

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
            Logging Out Successful!
          </Text>

          <Button
            status="success"
            accessoryRight={CheckIcon}
            onPress={(hideDialog, closeApp)}
          >
            Okay
          </Button>
        </Card>
      </Modal>
    </View>
  );
}

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
    flex: 1.75,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: "5%",
    alignItems: "center",
    paddingVertical: "5%",
  },
  innerFooter: { padding: "4%" },

  button: {
    padding: "4%",
  },
  text: {
    color: AppColors.red,
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "center",
  },
  backdrop: {
    backgroundColor: AppColors.background,
  },
});

export default AppQuickLogin;
