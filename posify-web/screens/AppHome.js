import React, { useCallback } from "react";
import { StyleSheet, View, FlatList, ScrollView, Linking } from "react-native";

import {
  Icon,
  Button,
  Text,
  BottomNavigation,
  BottomNavigationTab,
  Layout,
  Card,
  useTheme,
} from "@ui-kitten/components";
import { Provider, Portal, Dialog } from "react-native-paper";

import ExtendedButton from "../components/ExtendedButton";
import ExtendedCard from "../components/ExtendedCard";
import Screen from "../components/Screen";

import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";
import { ThemeContext } from "../configs/theme";

function AppHome({ navigation, route }) {
  const { user } = route.params;

  const theme = useTheme();

  const themeContext = React.useContext(ThemeContext);

  const closeApp = useCallback(async () => {
    await Linking.openURL("https://posify-web.web.app/");
  }, []);

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const HomeIcon = (props) => <Icon {...props} name="home-outline" />;
  const SettingsIcon = (props) => <Icon {...props} name="settings-2-outline" />;
  const AccountIcon = (props) => <Icon {...props} name="person-outline" />;
  const BannersIcon = (props) => <Icon {...props} name="layout-outline" />;
  const ReportsIcon = (props) => <Icon {...props} name="pie-chart-outline" />;
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

  const requestRef = firebase.firestore().collection("supplies");

  const [requests, setRequests] = React.useState([]);

  React.useEffect(() => {
    requestRef.onSnapshot(
      (querySnapshot) => {
        const newRequest = [];
        querySnapshot.forEach((doc) => {
          const request = doc.data();
          request.id = doc.id;
          newRequest.push(request);
        });
        setRequests(newRequest);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <Screen>
      <Layout>
        {AppRenderIf(
          selectedIndex == 0,
          <Text
            status="primary"
            category="h4"
            style={{ fontWeight: "bold", textAlign: "center", margin: "3%" }}
          >
            Home
          </Text>
        )}
        {AppRenderIf(
          selectedIndex == 1,
          <Text
            status="primary"
            category="h4"
            style={{
              fontWeight: "bold",
              textAlign: "center",
              margin: "3%",
              marginBottom: "1%",
            }}
          >
            Settings
          </Text>
        )}
      </Layout>
      {AppRenderIf(
        selectedIndex == 0 && user.type != "supplier",
        <ScrollView
          contentContainerStyle={{
            justifyContent: "center",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <ExtendedCard
              icon="file-text-outline"
              title="Invoices"
              onPress={() =>
                navigation.navigate("InvoicesScreen", {
                  user: user,
                })
              }
            />
            <ExtendedCard
              icon="repeat-outline"
              title="Requests"
              onPress={() =>
                navigation.navigate("RequestsScreen", {
                  user: user,
                })
              }
            />
          </View>
          {AppRenderIf(
            user.type == "admin",
            <>
              <View style={{ flexDirection: "row" }}>
                <ExtendedCard
                  icon="cube-outline"
                  title="Stock"
                  onPress={() => navigation.navigate("StockScreen")}
                />
                <ExtendedCard
                  icon="car-outline"
                  title="Supplies"
                  onPress={(values) => {
                    navigation.navigate("AppSelectSupply", {
                      user: user,
                    });
                  }}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <ExtendedCard
                  icon="shopping-cart-outline"
                  title="Stores"
                  onPress={() => navigation.navigate("ShopScreen")}
                />
                <ExtendedCard
                  icon="people-outline"
                  title="Employees"
                  onPress={() => navigation.navigate("EmployeeScreen")}
                />
              </View>
            </>
          )}
        </ScrollView>
      )}
      {AppRenderIf(
        selectedIndex == 0 && user.type == "supplier",
        <>
          <View style={styles.screen}>
            <FlatList
              data={requests.sort((a, b) =>
                a.requestID.localeCompare(b.requestID)
              )}
              keyExtractor={(request) => request.id}
              renderItem={({ item }) => (
                <>
                  {AppRenderIf(
                    null != item.supplier &&
                      item.delivered != true &&
                      item.unavailable != true,
                    <Card
                      status="primary"
                      style={{ margin: "2%" }}
                      onPress={(values) => {
                        navigation.navigate("AppSupply", {
                          request: {
                            docID: item.requestID,
                            requiredDate: item.requiredDate,
                            supplier: item.supplier,
                            received: item.received,
                            delivered: item.delivered,
                            unavailable: item.unavailable,
                            type: user.type,
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
                            name="archive-outline"
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              textTransform: "capitalize",
                            }}
                          >
                            {item.requiredDate}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.title}>Supply Request</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text category="label">{item.requestID}</Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  )}
                  {AppRenderIf(
                    null != item.supplier &&
                      item.delivered == true &&
                      item.received != true,
                    <Card
                      status="success"
                      style={{ margin: "2%" }}
                      onPress={(values) => {
                        navigation.navigate("AppSupply", {
                          request: {
                            docID: item.requestID,
                            requiredDate: item.requiredDate,
                            supplier: item.supplier,
                            received: item.received,
                            delivered: item.delivered,
                            unavailable: item.unavailable,
                            type: user.type,
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
                            name="archive-outline"
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              textTransform: "capitalize",
                            }}
                          >
                            {item.requiredDate}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.title}>Supply Request</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text category="label">{item.requestID}</Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  )}
                  {AppRenderIf(
                    null != item.supplier && item.received == true,
                    <Card
                      status="basic"
                      style={{ margin: "2%" }}
                      onPress={(values) => {
                        navigation.navigate("AppSupply", {
                          request: {
                            docID: item.requestID,
                            requiredDate: item.requiredDate,
                            supplier: item.supplier,
                            received: item.received,
                            delivered: item.delivered,
                            unavailable: item.unavailable,
                            type: user.type,
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
                            name="archive-outline"
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              textTransform: "capitalize",
                            }}
                          >
                            {item.requiredDate}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.title}>Supply Request</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text category="label">{item.requestID}</Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  )}
                  {AppRenderIf(
                    null != item.supplier && item.unavailable == true,
                    <Card
                      status="danger"
                      style={{ margin: "2%" }}
                      onPress={(values) => {
                        navigation.navigate("AppSupply", {
                          request: {
                            docID: item.requestID,
                            requiredDate: item.requiredDate,
                            supplier: item.supplier,
                            received: item.received,
                            delivered: item.delivered,
                            unavailable: item.unavailable,
                            type: user.type,
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
                            name="archive-outline"
                          />
                          <Text
                            style={{
                              fontSize: 12,
                              textTransform: "capitalize",
                            }}
                          >
                            {item.requiredDate}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.title}>Supply Request</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text category="label">{item.requestID}</Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  )}
                </>
              )}
            />
          </View>
        </>
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
            {AppRenderIf(
              user.type == "admin",
              <>
                <ExtendedButton
                  title="Reports"
                  tabIcon={ReportsIcon}
                  onPress={() => navigation.navigate("ReportScreen")}
                />

                <ExtendedButton
                  title="Banners"
                  tabIcon={BannersIcon}
                  onPress={() => navigation.navigate("AppBanners")}
                />
              </>
            )}

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
        style={{ paddingVertical: "2.5%" }}
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
