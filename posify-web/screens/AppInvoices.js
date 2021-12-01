import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import { Icon, Card, Button, Text, useTheme } from "@ui-kitten/components";
import { Provider, Portal, Dialog, Paragraph } from "react-native-paper";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";
import AppColors from "../configs/AppColors";

function AppInvoices({ navigation, route }) {
  const { user } = route.params;

  const theme = useTheme();

  const CancelIcon = (props) => <Icon {...props} name="slash-outline" />;
  const CheckIcon = (props) => (
    <Icon {...props} name="checkmark-circle-outline" />
  );
  const NewIcon = (props) => <Icon {...props} name="plus-outline" />;

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

  const [storeInvoices, setStoreInvoices] = React.useState([]);

  const storeInvoiceRef = firebase
    .firestore()
    .collection("invoices")
    .where("shopName", "==", user.fullName);

  React.useEffect(() => {
    storeInvoiceRef.onSnapshot(
      (querySnapshot) => {
        const newStoreInvoice = [];
        querySnapshot.forEach((doc) => {
          const storeInvoice = doc.data();
          storeInvoice.id = doc.id;
          newStoreInvoice.push(storeInvoice);
        });
        setStoreInvoices(newStoreInvoice);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <Provider>
      <Screen>
        <View style={styles.screen}>
          {AppRenderIf(
            user.type == "admin" || user.type == "employee",
            <FlatList
              contentContainerStyle={{ width: "40%", alignSelf: "center" }}
              data={Invoices.sort((a, b) =>
                a.invoiceID.localeCompare(b.invoiceID)
              )}
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
                    null != item.shopName && item.preparing != true,
                    <Card
                      status="primary"
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
                            preparing: item.preparing,
                            prepared: item.prepared,
                            delivered: item.delivered,
                          },
                          user: user,
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
                          <Text
                            style={{ fontSize: 12 }}
                            style={{ color: AppColors.primary }}
                          >
                            {item.invoiceID}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.title}>{item.shopName}</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{ color: AppColors.primary }}
                              category="label"
                            >
                              {item.date}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  )}
                  {AppRenderIf(
                    null != item.shopName &&
                      item.preparing == true &&
                      item.prepared != true,
                    <Card
                      status="warning"
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
                            preparing: item.preparing,
                            prepared: item.prepared,
                            delivered: item.delivered,
                          },
                          user: user,
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
                          <Text
                            style={{ fontSize: 12 }}
                            style={{ color: AppColors.primary }}
                          >
                            {item.invoiceID}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.title}>{item.shopName}</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{ color: AppColors.primary }}
                              category="label"
                            >
                              {item.date}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  )}
                  {AppRenderIf(
                    null != item.shopName &&
                      item.prepared == true &&
                      item.delivered != true,
                    <Card
                      status="success"
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
                            preparing: item.preparing,
                            prepared: item.prepared,
                            delivered: item.delivered,
                          },
                          user: user,
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
                          <Text
                            style={{ fontSize: 12 }}
                            style={{ color: AppColors.primary }}
                          >
                            {item.invoiceID}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.title}>{item.shopName}</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{ color: AppColors.primary }}
                              category="label"
                            >
                              {item.date}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  )}

                  {AppRenderIf(
                    null != item.shopName && item.delivered == true,
                    <Card
                      status="basic"
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
                            preparing: item.preparing,
                            prepared: item.prepared,
                            delivered: item.delivered,
                          },
                          user: user,
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
                          <Text
                            style={{ fontSize: 12 }}
                            style={{ color: AppColors.primary }}
                          >
                            {item.invoiceID}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.title}>{item.shopName}</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{ color: AppColors.primary }}
                              category="label"
                            >
                              {item.date}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  )}
                </>
              )}
            />
          )}
          {AppRenderIf(
            user.type == "store",
            <FlatList
              data={storeInvoices.sort((a, b) =>
                a.invoiceID.localeCompare(b.invoiceID)
              )}
              keyExtractor={(invoice) => invoice.id}
              renderItem={({ item }) => (
                <>
                  {AppRenderIf(
                    null != item.shopName && item.preparing != true,
                    <Card
                      status="primary"
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
                            preparing: item.preparing,
                            prepared: item.prepared,
                            delivered: item.delivered,
                          },
                          user: user,
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
                          <Text
                            style={{ fontSize: 12 }}
                            style={{ color: AppColors.primary }}
                          >
                            {item.invoiceID}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.title}>{item.shopName}</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{ color: AppColors.primary }}
                              category="label"
                            >
                              {item.date}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  )}
                  {AppRenderIf(
                    null != item.shopName &&
                      item.preparing == true &&
                      item.prepared != true,
                    <Card
                      status="warning"
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
                            preparing: item.preparing,
                            prepared: item.prepared,
                            delivered: item.delivered,
                          },
                          user: user,
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
                          <Text
                            style={{ fontSize: 12 }}
                            style={{ color: AppColors.primary }}
                          >
                            {item.invoiceID}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.title}>{item.shopName}</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{ color: AppColors.primary }}
                              category="label"
                            >
                              {item.date}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  )}
                  {AppRenderIf(
                    null != item.shopName &&
                      item.prepared == true &&
                      item.delivered != true,
                    <Card
                      status="success"
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
                            preparing: item.preparing,
                            prepared: item.prepared,
                            delivered: item.delivered,
                          },
                          user: user,
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
                          <Text
                            style={{ fontSize: 12 }}
                            style={{ color: AppColors.primary }}
                          >
                            {item.invoiceID}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.title}>{item.shopName}</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{ color: AppColors.primary }}
                              category="label"
                            >
                              {item.date}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  )}

                  {AppRenderIf(
                    null != item.shopName && item.delivered == true,
                    <Card
                      status="basic"
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
                            preparing: item.preparing,
                            prepared: item.prepared,
                            delivered: item.delivered,
                          },
                          user: user,
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
                          <Text
                            style={{ fontSize: 12 }}
                            style={{ color: AppColors.primary }}
                          >
                            {item.invoiceID}
                          </Text>
                        </View>

                        <View style={{ flexDirection: "column" }}>
                          <Text style={styles.title}>{item.shopName}</Text>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text
                              style={{ color: AppColors.primary }}
                              category="label"
                            >
                              {item.date}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Card>
                  )}
                </>
              )}
            />
          )}
          <Portal>
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>Confirmation</Dialog.Title>
              <Dialog.Content>
                <Paragraph>Confirm Creating a New Invoice</Paragraph>
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
        {AppRenderIf(
          user.type == "admin" || user.type == "employee",
          <Button
            size="large"
            style={styles.fab}
            status="primary"
            accessoryLeft={NewIcon}
            onPress={showDialog}
          />
        )}
      </Screen>
    </Provider>
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
    color: AppColors.primary,
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 25,
  },
});

export default AppInvoices;
