import React from "react";
import {
  Icon,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
  Text,
  Button,
  Layout,
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
  ScrollView,
} from "react-native";
import { firebase } from "../configs/Database";
import AppColors from "../configs/AppColors";
import Screen from "../components/Screen";

function AppQuickLogin({ navigation }) {
  const { height } = Dimensions.get("screen");
  const height_logo = height * 0.13;

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

  const [visible, setVisible] = React.useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const closeApp = () => BackHandler.exitApp();

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
        <Text style={styles.text}>Welcome to Posify!</Text>

        <View style={styles.innerFooter}>
          <ScrollView>
            <Card
              style={{ borderRadius: 10, borderColor: AppColors.primary }}
              onPress={() =>
                navigation.navigate("AppHome", {
                  user: user,
                })
              }
            >
              <Layout
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Layout
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Icon
                    style={{ width: 30, height: 30, margin: "5%" }}
                    fill={AppColors.primary}
                    name="person-outline"
                  />
                  <Text
                    category="h6"
                    style={{ fontWeight: "bold" }}
                    status="primary"
                  >
                    Quick Login
                  </Text>
                </Layout>
                <Icon
                  style={{
                    width: 30,
                    height: 30,
                    margin: "5%",
                    alignSelf: "flex-end",
                  }}
                  fill={AppColors.primary}
                  name="chevron-right-outline"
                />
              </Layout>
            </Card>
          </ScrollView>
        </View>
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
    flex: 0.75,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: "8%",
    paddingHorizontal: "5%",
    justifyContent: "center",
  },
  innerFooter: { padding: "4%", marginTop: "5%" },

  button: {
    padding: "4%",
    margin: "2%",
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

export default AppQuickLogin;
