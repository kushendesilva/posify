import React from "react";
import { StyleSheet, BackHandler } from "react-native";
import ExtendedButton from "../components/ExtendedButton";
import {
  Icon,
  Button,
  Text,
  BottomNavigation,
  BottomNavigationTab,
  Layout,
} from "@ui-kitten/components";
import { Provider, Portal, Dialog } from "react-native-paper";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";
import { ThemeContext } from "../configs/theme";
import { ScrollView } from "react-native";
import Screen from "../components/Screen";

function AppHome({ navigation }) {
  const themeContext = React.useContext(ThemeContext);

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

  const closeApp = () => BackHandler.exitApp();

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const HomeIcon = (props) => <Icon {...props} name="home-outline" />;
  const SettingsIcon = (props) => <Icon {...props} name="settings-2-outline" />;
  const AccountIcon = (props) => <Icon {...props} name="person-outline" />;
  const ReqIcon = (props) => <Icon {...props} name="repeat-outline" />;
  const StockIcon = (props) => <Icon {...props} name="cube-outline" />;
  const SuppliersIcon = (props) => <Icon {...props} name="car-outline" />;
  const StoresIcon = (props) => (
    <Icon {...props} name="shopping-cart-outline" />
  );
  const EmployeesIcon = (props) => <Icon {...props} name="people-outline" />;
  const ReportsIcon = (props) => <Icon {...props} name="archive-outline" />;
  const HelpIcon = (props) => (
    <Icon {...props} name="question-mark-circle-outline" />
  );
  const LogOutIcon = (props) => <Icon {...props} name="log-out-outline" />;
  const DarkIcon = (props) => <Icon {...props} name="moon-outline" />;
  const LightIcon = (props) => <Icon {...props} name="sun-outline" />;
  const CheckIcon = (props) => (
    <Icon {...props} name="checkmark-circle-outline" />
  );

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  return (
    <Screen>
      <Layout style={{}}>
        {AppRenderIf(
          selectedIndex == 0,
          <Text
            status="primary"
            category="h4"
            style={{ fontWeight: "bold", textAlign: "center", margin: "2%" }}
          >
            Home
          </Text>
        )}
        {AppRenderIf(
          selectedIndex == 1,
          <Text
            status="primary"
            category="h4"
            style={{ fontWeight: "bold", textAlign: "center", margin: "2%" }}
          >
            Settings
          </Text>
        )}
      </Layout>
      {AppRenderIf(
        selectedIndex == 0,
        <ScrollView>
          <ExtendedButton
            title="Invoices"
            tabIcon={ReqIcon}
            onPress={() =>
              navigation.navigate("InvoicesScreen", {
                user: user,
              })
            }
          />
          <ExtendedButton
            title="Requests"
            tabIcon={ReqIcon}
            onPress={() =>
              navigation.navigate("RequestsScreen", {
                user: user,
              })
            }
          />
          <ExtendedButton
            title="Stock"
            tabIcon={StockIcon}
            onPress={() => navigation.navigate("StockScreen")}
          />
          <ExtendedButton
            title="Suppliers"
            tabIcon={SuppliersIcon}
            onPress={() => navigation.navigate("SuppliersScreen")}
          />
          <ExtendedButton
            title="Stores"
            tabIcon={StoresIcon}
            onPress={() => navigation.navigate("ShopScreen")}
          />
          <ExtendedButton
            title="Employees"
            tabIcon={EmployeesIcon}
            onPress={() => navigation.navigate("EmployeeScreen")}
          />
        </ScrollView>
      )}
      {AppRenderIf(
        selectedIndex == 1,
        <ScrollView>
          <Provider>
            <ExtendedButton
              title="Account Information"
              tabIcon={AccountIcon}
              onPress={() =>
                navigation.navigate("ProfileScreen", {
                  user: user,
                })
              }
            />
            <ExtendedButton
              title="Reports"
              tabIcon={ReportsIcon}
              onPress={() => navigation.navigate("ReportScreen")}
            />

            {AppRenderIf(
              themeContext.theme == "light",
              <ExtendedButton
                title="Dark Theme"
                tabIcon={DarkIcon}
                onPress={themeContext.toggleTheme}
              />
            )}
            {AppRenderIf(
              themeContext.theme != "light",
              <ExtendedButton
                title="Light Theme"
                tabIcon={LightIcon}
                onPress={themeContext.toggleTheme}
              />
            )}

            <ExtendedButton
              title="Help"
              tabIcon={HelpIcon}
              onPress={() => navigation.navigate("AppHelp")}
            />

            <ExtendedButton
              title="Log Out"
              tabIcon={LogOutIcon}
              onPress={() => {
                firebase
                  .auth()
                  .signOut()
                  .then(
                    () => {
                      showDialog();
                    },
                    function (error) {
                      // An error happened.
                    }
                  );
              }}
            />

            <Portal>
              <Dialog visible={visible} onDismiss={closeApp}>
                <Dialog.Title>
                  <Text category="h6" style={{ fontWeight: "bold" }}>
                    Notice
                  </Text>
                </Dialog.Title>
                <Dialog.Content>
                  <Text category="label">Logging Out Successful!</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    status="success"
                    accessoryRight={CheckIcon}
                    onPress={(hideDialog, closeApp)}
                  >
                    Okay
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </Provider>
        </ScrollView>
      )}
      <BottomNavigation
        style={{ paddingVertical: "2%" }}
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
      >
        <BottomNavigationTab icon={HomeIcon} title="HOME" />
        <BottomNavigationTab icon={SettingsIcon} title="SETTINGS" />
      </BottomNavigation>
    </Screen>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  screen: { flex: 1 },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
});

export default AppHome;
