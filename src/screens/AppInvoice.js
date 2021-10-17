import React from "react";
import { View, FlatList, ScrollView } from "react-native";
import {
  DataTable,
  Text,
  Title,
  Appbar,
  Caption,
  Divider,
  Portal,
  Provider,
  Paragraph,
  Dialog,
} from "react-native-paper";
import { Button, CheckBox } from "@ui-kitten/components";
import * as Print from "expo-print";
import AppColors from "../configs/AppColors";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";

function AppInvoice({ route, navigation }) {
  const { invoice, user } = route.params;

  const [preparingChecked, setPreparingChecked] = React.useState(
    invoice.preparing
  );
  const [preparedChecked, setPreparedChecked] = React.useState(
    invoice.prepared
  );
  const [deliveredChecked, setDeliveredChecked] = React.useState(
    invoice.delivered
  );

  const hideComponents = () => {
    setShowComponents(false);
  };
  const printPDF = async () => {
    await Print.printToFileAsync();
    setShowComponents(true);
  };

  const [showComponents, setShowComponents] = React.useState(true);

  const [visible, setVisible] = React.useState(false);

  const showConfirmation = () => setVisible(true);

  const hideConfirmation = () => setVisible(false);

  const onDeleteButtonPress = () => {
    firebase
      .firestore()
      .collection("invoices")
      .doc(invoice.docID)
      .delete()
      .then(
        () => {
          hideConfirmation();
          navigation.goBack();
        },
        function (error) {
          // An error happened.
        }
      );
  };

  const [InvoiceItem, setInvoiceItems] = React.useState([]);

  const invoiceItemRef = firebase
    .firestore()
    .collection("invoices")
    .doc(invoice.docID)
    .collection("invItems");

  React.useEffect(() => {
    invoiceItemRef.onSnapshot(
      (querySnapshot) => {
        const newInvoiceItem = [];
        querySnapshot.forEach((doc) => {
          const invoiceItem = doc.data();
          invoiceItem.id = doc.id;
          newInvoiceItem.push(invoiceItem);
        });
        setInvoiceItems(newInvoiceItem);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const [ReturnItems, setReturnItems] = React.useState([]);

  const returnItemsRef = firebase
    .firestore()
    .collection("invoices")
    .doc(invoice.docID)
    .collection("returnItems");

  React.useEffect(() => {
    returnItemsRef.onSnapshot(
      (querySnapshot) => {
        const newReturnItems = [];
        querySnapshot.forEach((doc) => {
          const returnItems = doc.data();
          returnItems.id = doc.id;
          newReturnItems.push(returnItems);
        });
        setReturnItems(newReturnItems);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const requestRef = firebase
    .firestore()
    .collection("invoices")
    .doc(invoice.docID);

  const onChecked = () => {
    const data = {
      preparing: preparingChecked,
      prepared: preparedChecked,
      delivered: deliveredChecked,
    };
    requestRef
      .update(data)
      .then((_doc) => {
        navigation.goBack();
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <Provider>
      <ScrollView>
        {AppRenderIf(
          showComponents == true,
          <Appbar
            style={{
              backgroundColor: AppColors.primary,
              elevation: 0,
            }}
          >
            <Appbar.BackAction onPress={() => navigation.goBack()} />
            {AppRenderIf(
              preparingChecked == true &&
                (user.type == "admin" || user.type == "employee"),
              <Appbar.Action
                icon="refresh"
                onPress={() => {
                  setPreparingChecked(false);
                  setPreparedChecked(false);
                  setDeliveredChecked(false);
                }}
              />
            )}
            {AppRenderIf(
              preparingChecked != true,
              <Appbar.Content title="Invoice" subtitle={invoice.docID} />
            )}
            {AppRenderIf(
              preparingChecked == true && preparedChecked != true,
              <Appbar.Content title="Invoice" subtitle="Preparing" />
            )}
            {AppRenderIf(
              preparedChecked == true && deliveredChecked != true,
              <Appbar.Content title="Invoice" subtitle="Prepared" />
            )}
            {AppRenderIf(
              deliveredChecked == true,
              <Appbar.Content title="Invoice" subtitle="Delivered" />
            )}
            {AppRenderIf(
              user.type == "admin" || user.type == "employee",
              <>
                {AppRenderIf(
                  preparingChecked != true,
                  <View
                    style={{
                      borderRadius: 4,
                      margin: 2,
                      padding: 6,
                      backgroundColor: AppColors.yellow,
                    }}
                  >
                    <CheckBox
                      style={{ margin: 2 }}
                      status="control"
                      checked={preparingChecked}
                      onChange={(nextChecked) =>
                        setPreparingChecked(nextChecked)
                      }
                    >
                      Preparing
                    </CheckBox>
                  </View>
                )}

                {AppRenderIf(
                  preparingChecked == true &&
                    preparedChecked != true &&
                    deliveredChecked != true,
                  <View
                    style={{
                      borderRadius: 4,
                      margin: 2,
                      padding: 6,
                      backgroundColor: AppColors.green,
                    }}
                  >
                    <CheckBox
                      style={{ margin: 2 }}
                      status="control"
                      checked={preparedChecked}
                      onChange={(nextChecked) =>
                        setPreparedChecked(nextChecked)
                      }
                    >
                      Prepared
                    </CheckBox>
                  </View>
                )}
                {AppRenderIf(
                  preparedChecked == true && deliveredChecked != true,
                  <View
                    style={{
                      borderRadius: 4,
                      margin: 2,
                      padding: 6,
                      backgroundColor: AppColors.secondary,
                    }}
                  >
                    <CheckBox
                      style={{ margin: 2 }}
                      status="control"
                      checked={deliveredChecked}
                      onChange={(nextChecked) =>
                        setDeliveredChecked(nextChecked)
                      }
                    >
                      Delivered
                    </CheckBox>
                  </View>
                )}
              </>
            )}
            {AppRenderIf(
              user.type == "admin" || user.type == "employee",
              <Appbar.Action icon="check-all" onPress={onChecked} />
            )}
            <Appbar.Action
              icon="printer"
              onPress={() => {
                setShowComponents(false);
              }}
            />
            {AppRenderIf(
              user.type == "admin",
              <Appbar.Action
                icon="trash-can-outline"
                onPress={showConfirmation}
              />
            )}
          </Appbar>
        )}
        <View style={{ paddingBottom: "5%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              padding: "2%",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Caption>Invoice : {invoice.docID}</Caption>
              <Caption>Date : {invoice.date.toString()}</Caption>
              <Caption>Shop : {invoice.shopName}</Caption>
            </View>
          </View>
          <Divider />
          <DataTable>
            <DataTable.Header>
              <DataTable.Cell>Payment Method :</DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={{ textTransform: "capitalize" }}>
                  {invoice.payMethod}
                </Text>
              </DataTable.Cell>
            </DataTable.Header>
          </DataTable>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Items</DataTable.Title>
              <DataTable.Title numeric>Unit Price</DataTable.Title>
              <DataTable.Title numeric>Quantity</DataTable.Title>
              <DataTable.Title numeric>Price</DataTable.Title>
            </DataTable.Header>
            <FlatList
              data={InvoiceItem}
              keyExtractor={(invoice) => invoice.id}
              renderItem={({ item }) => (
                <DataTable.Row>
                  <DataTable.Cell>{item.itemName}</DataTable.Cell>
                  <DataTable.Cell numeric>Rs.{item.unitPrice}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    Rs.{item.unitPrice * item.quantity}
                  </DataTable.Cell>
                </DataTable.Row>
              )}
            />
          </DataTable>
          <Title
            style={{
              fontWeight: "bold",
              fontSize: 16,
              alignSelf: "flex-end",
              marginEnd: "3.5%",
            }}
          >
            Total : Rs.{invoice.total}
          </Title>
          <Divider />
          <DataTable>
            <DataTable.Header>
              <DataTable.Cell style={{ justifyContent: "center" }}>
                Returns
              </DataTable.Cell>
            </DataTable.Header>
          </DataTable>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Items</DataTable.Title>
              <DataTable.Title numeric>Unit Price</DataTable.Title>
              <DataTable.Title numeric>Quantity</DataTable.Title>
              <DataTable.Title numeric>Price</DataTable.Title>
            </DataTable.Header>
            <FlatList
              data={ReturnItems}
              keyExtractor={(invoice) => invoice.id}
              renderItem={({ item }) => (
                <DataTable.Row>
                  <DataTable.Cell>{item.itemName}</DataTable.Cell>
                  <DataTable.Cell numeric>Rs.{item.unitPrice}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    Rs.{item.unitPrice * item.quantity}
                  </DataTable.Cell>
                </DataTable.Row>
              )}
            />
          </DataTable>
          <Title
            style={{
              fontWeight: "bold",
              fontSize: 16,
              alignSelf: "flex-end",
              marginEnd: "3.5%",
            }}
          >
            Total Returns: Rs.{invoice.returns}
          </Title>
          <Divider />
          <Title
            style={{
              fontWeight: "bold",
              fontSize: 16,
              alignSelf: "flex-end",
              marginEnd: "3.5%",
            }}
          >
            Total After the Deduction of Returns: Rs.
            {invoice.total - invoice.returns}
          </Title>
          {AppRenderIf(
            showComponents == false,
            <Button
              icon="printer"
              onPress={() => {
                printPDF();
              }}
              onLongPress={() => {
                setShowComponents(true);
              }}
            >
              මුද්‍රණය කරන්න
            </Button>
          )}
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideConfirmation}>
            <Dialog.Title>Confirmation</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Delete {invoice.docID} invoice data.</Paragraph>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
              <Button status="danger" onPress={hideConfirmation}>
                Cancel
              </Button>
              <Button
                status="success"
                onPress={() => {
                  onDeleteButtonPress();
                }}
              >
                Confirm
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </ScrollView>
    </Provider>
  );
}

export default AppInvoice;
