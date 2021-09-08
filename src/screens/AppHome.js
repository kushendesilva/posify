import React from "react";
import { View, FlatList, TouchableHighlight, StyleSheet } from "react-native";
import ExtendedButton from "../components/ExtendedButton";
import Screen from "../components/Screen";
import { TabBar, Tab, Icon, Card, Button } from "@ui-kitten/components";
import {
  Avatar,
  Title,
  Caption,
  Provider,
  Portal,
  Dialog,
  Paragraph,
} from "react-native-paper";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";
import AppColors from "../configs/AppColors";

function AppHome({ navigation, route }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const HomeIcon = (props) => <Icon {...props} name="home-outline" />;
  const NewIcon = (props) => <Icon {...props} name="trending-up-outline" />;
  const AccountIcon = (props) => <Icon {...props} name="person-outline" />;

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
        <Tab icon={NewIcon} />
        <Tab icon={AccountIcon} />
        <Tab icon={HomeIcon} />
      </TabBar>
      {AppRenderIf(
        selectedIndex == 0,
        <Provider>
          <View style={styles.screen}>
            <FlatList
              ListHeaderComponent={() => (
                <>
                  <ExtendedButton
                    title="New Invoices"
                    tabIcon={HomeIcon}
                    onPress={showDialog}
                  />
                  <ExtendedButton title="Requests" tabIcon={HomeIcon} />
                </>
              )}
              data={Invoices}
              keyExtractor={(invoice) => invoice.id}
              renderItem={({ item }) => (
                <>
                  {AppRenderIf(
                    null == item.shopName,
                    <TouchableHighlight
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
                            <Avatar.Icon size={40} icon="file-document" />
                            <Title style={{ fontSize: 12 }}>
                              {item.invoiceID}
                            </Title>
                          </View>
                        </View>
                        <Caption
                          style={{
                            textAlign: "center",
                          }}
                        >
                          No Data Found. Please Remove This Record
                        </Caption>
                        <Caption
                          style={{
                            fontSize: 10,
                            color: AppColors.red,
                            textAlign: "center",
                          }}
                        >
                          (Confirm Whether this is an Invoice in the process of
                          generating)
                        </Caption>
                      </View>
                    </TouchableHighlight>
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
                            style={{ width: 32, height: 32 }}
                            fill={AppColors.primary}
                            name="file-text-outline"
                          />
                          <Title style={{ fontSize: 12 }}>
                            {item.invoiceID}
                          </Title>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Title style={styles.title}>{item.shopName}</Title>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Caption style={styles.caption}>
                              {item.date}
                            </Caption>
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
                  <Button onPress={hideDialog} status="danger">
                    Cancel
                  </Button>

                  <Button
                    onPress={() => {
                      hideDialog(), navigation.navigate("AddInvoiceScreens");
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
          <ExtendedButton title="Stock" tabIcon={HomeIcon} />
          <ExtendedButton title="Suppliers" tabIcon={HomeIcon} />
          <ExtendedButton title="Stores" tabIcon={HomeIcon} />
          <ExtendedButton title="Employees" tabIcon={HomeIcon} />
        </>
      )}
      {AppRenderIf(
        selectedIndex == 2,
        <>
          <ExtendedButton title="Account Information" tabIcon={HomeIcon} />
          <ExtendedButton title="Reports" tabIcon={HomeIcon} />
          <ExtendedButton title="Log Out" tabIcon={HomeIcon} />
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
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
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
