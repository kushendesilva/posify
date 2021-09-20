import React from "react";
import { View, FlatList, StyleSheet, BackHandler } from "react-native";
import ExtendedButton from "../components/ExtendedButton";
import Screen from "../components/Screen";
import {
  TabBar,
  Tab,
  Icon,
  Card,
  Button,
  Text,
  useTheme,
} from "@ui-kitten/components";
import { Provider, Portal, Dialog, Paragraph } from "react-native-paper";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";
import AppColors from "../configs/AppColors";
import { ThemeContext } from "../configs/theme";

function AppHome({ navigation }) {
  const theme = useTheme();

  const CancelIcon = (props) => <Icon {...props} name="slash-outline" />;
  const CheckIcon = (props) => (
    <Icon {...props} name="checkmark-circle-outline" />
  );

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
  const ManagementIcon = (props) => (
    <Icon {...props} name="briefcase-outline" />
  );
  const SettingsIcon = (props) => <Icon {...props} name="settings-2-outline" />;
  const AccountIcon = (props) => <Icon {...props} name="person-outline" />;
  const NewInvIcon = (props) => <Icon {...props} name="file-add-outline" />;
  const ReqIcon = (props) => <Icon {...props} name="flip-2-outline" />;
  const StockIcon = (props) => <Icon {...props} name="layers-outline" />;
  const SuppliersIcon = (props) => <Icon {...props} name="car-outline" />;
  const StoresIcon = (props) => (
    <Icon {...props} name="shopping-cart-outline" />
  );
  const EmployeesIcon = (props) => <Icon {...props} name="people-outline" />;
  const ReportsIcon = (props) => <Icon {...props} name="archive-outline" />;
  const LogOutIcon = (props) => <Icon {...props} name="log-out-outline" />;
  const DarkIcon = (props) => <Icon {...props} name="moon-outline" />;
  const LightIcon = (props) => <Icon {...props} name="sun-outline" />;

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [Invoices, setInvoices] = React.useState([]);

  const invoiceRef = firebase.firestore().collection("invoices");

  React.useEffect(() => {
    invoiceRef.onSnapshot(
      (querySnapshot) => {
        const newInvoice = [];
        querySnapshot.forEach((doc) => {
          const invoice = doc.data();
          invoice.id = doc.id;
          newInvoice.push(invoice);
        });
        setInvoices(newInvoice);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <Screen>
      <TabBar
        style={{ marginVertical: "3%" }}
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
      >
        <Tab icon={HomeIcon} />
        <Tab icon={ManagementIcon} />
        <Tab icon={SettingsIcon} />
      </TabBar>
      {AppRenderIf(
        selectedIndex == 0,
        <Provider>
          <View style={styles.screen}>
            <FlatList
              ListHeaderComponent={() => (
                <>
                  <ExtendedButton
                    title="New Invoice"
                    tabIcon={NewInvIcon}
                    onPress={showDialog}
                  />
                  <ExtendedButton title="Requests" tabIcon={ReqIcon} />
                  <Text
                    category="h4"
                    style={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    Invoices
                  </Text>
                </>
              )}
              data={Invoices}
              keyExtractor={(invoice) => invoice.id}
              renderItem={({ item }) => (
                <>
                  {AppRenderIf(
                    null == item.shopName,
                    <Card
                      style={{ margin: "2%" }}
                      onPress={(values) => {
                        navigation.navigate("AppDelInvoice", {
                          invoice: {
                            docID: item.invoiceID,
                          },
                        });
                      }}
                    >
                      <View style={styles.invoiceInfoSection}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                        >
                          <View
                            style={{
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Icon
                              style={{ width: 30, height: 30, margin: "2%" }}
                              fill={theme["color-primary-default"]}
                              name="file-remove-outline"
                            />
                            <Text style={{ fontSize: 12 }}>
                              {item.invoiceID}
                            </Text>
                          </View>
                        </View>
                        <Text
                          category="label"
                          style={{
                            textAlign: "center",
                          }}
                        >
                          No Data Found. Please Remove This Record
                        </Text>
                        <Text
                          style={{
                            fontSize: 10,
                            color: AppColors.red,
                            textAlign: "center",
                          }}
                        >
                          (Confirm Whether this is an Invoice in the process of
                          generating)
                        </Text>
                      </View>
                    </Card>
                  )}
                  {AppRenderIf(
                    null != item.shopName,
                    <Card
                      style={{ margin: "2%" }}
                      onLongPress={(values) => {
                        navigation.navigate("AppDelInvoice", {
                          invoice: {
                            docID: item.invoiceID,
                          },
                        });
                      }}
                      onPress={(values) => {
                        navigation.navigate("AppInvoice", {
                          invoice: {
                            docID: item.invoiceID,
                            payMethod: item.payMethod,
                            returns: item.returns,
                            shopName: item.shopName,
                            date: item.date,
                            total: item.total,
                          },
                        });
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-evenly",
                        }}
                      >
                        <View
                          style={{
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Icon
                            style={{ width: 30, height: 30, margin: "2%" }}
                            fill={theme["color-primary-default"]}
                            name="file-text-outline"
                          />
                          <Text style={{ fontSize: 12 }}>{item.invoiceID}</Text>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.title}>{item.shopName}</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text category="label">{item.date}</Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  )}
                </>
              )}
            />
            <Portal>
              <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Title>Notice</Dialog.Title>
                <Dialog.Content>
                  <Paragraph>Confirmation</Paragraph>
                </Dialog.Content>
                <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
                  <Button
                    accessoryRight={CancelIcon}
                    onPress={hideDialog}
                    status="danger"
                  >
                    Cancel
                  </Button>

                  <Button
                    accessoryRight={CheckIcon}
                    onPress={() => {
                      hideDialog(), navigation.navigate("SelectShopScreen");
                    }}
                    status="success"
                  >
                    Confirm
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </View>
        </Provider>
      )}

      {AppRenderIf(
        selectedIndex == 1,
        <>
          <ExtendedButton
            title="Stock"
            tabIcon={StockIcon}
            onPress={() => navigation.navigate("StockScreen")}
          />
          <ExtendedButton title="Suppliers" tabIcon={SuppliersIcon} />
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
        </>
      )}
      {AppRenderIf(
        selectedIndex == 2,
        <>
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
                    accessoryRight={CheckIcon}
                    onPress={(hideDialog, closeApp)}
                  >
                    Okay
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </Provider>
        </>
      )}
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
