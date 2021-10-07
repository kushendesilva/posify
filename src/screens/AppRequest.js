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
import { Button } from "@ui-kitten/components";
import AppColors from "../configs/AppColors";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";

function AppRequest({ route, navigation }) {
  const { request } = route.params;

  const [visible, setVisible] = React.useState(false);

  const showConfirmation = () => setVisible(true);

  const hideConfirmation = () => setVisible(false);

  const onDeleteButtonPress = () => {
    firebase
      .firestore()
      .collection("requests")
      .doc(request.docID)
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

  const [RequestItem, setRequestItems] = React.useState([]);

  const requestItemRef = firebase
    .firestore()
    .collection("requests")
    .doc(request.docID)
    .collection("invItems");

  React.useEffect(() => {
    requestItemRef.onSnapshot(
      (querySnapshot) => {
        const newRequestItem = [];
        querySnapshot.forEach((doc) => {
          const requestItem = doc.data();
          requestItem.id = doc.id;
          newRequestItem.push(requestItem);
        });
        setRequestItems(newRequestItem);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <Provider>
      <ScrollView>
        <Appbar style={{ backgroundColor: AppColors.primary }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Request" subtitle={request.docID} />
          <Appbar.Action icon="trash-can-outline" onPress={showConfirmation} />
        </Appbar>
        <View style={{ paddingBottom: "5%" }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              padding: "2%",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Caption>Request : {request.docID}</Caption>
              <Caption>Date : {request.date.toString()}</Caption>
              <Caption>Shop : {request.shopName}</Caption>
            </View>
          </View>
          <Divider />
          <DataTable>
            <DataTable.Header>
              <DataTable.Cell>Payment Method :</DataTable.Cell>
              <DataTable.Cell numeric>
                <Text style={{ textTransform: "capitalize" }}>
                  {request.payMethod}
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
              data={RequestItem}
              keyExtractor={(request) => request.id}
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
            Total : Rs.{request.total}
          </Title>
          <Divider />
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideConfirmation}>
            <Dialog.Title>Confirmation</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Delete {request.docID} request data.</Paragraph>
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

export default AppRequest;
