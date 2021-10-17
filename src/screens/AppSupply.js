import React from "react";
import { View, FlatList, ScrollView } from "react-native";
import {
  DataTable,
  Title,
  Appbar,
  Caption,
  Divider,
  Portal,
  Provider,
  Paragraph,
  Dialog,
} from "react-native-paper";
import { CheckBox, Button } from "@ui-kitten/components";
import AppColors from "../configs/AppColors";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";

function AppSupply({ route, navigation }) {
  const { request } = route.params;

  const [receivedChecked, setReceivedChecked] = React.useState(
    request.received
  );
  const [deliveredChecked, setDeliveredChecked] = React.useState(
    request.delivered
  );
  const [unavailableChecked, setUnavailableChecked] = React.useState(
    request.unavailable
  );

  const [visible, setVisible] = React.useState(false);

  const showConfirmation = () => setVisible(true);

  const hideConfirmation = () => setVisible(false);

  const onDeleteButtonPress = () => {
    firebase
      .firestore()
      .collection("supplies")
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

  const requestRef = firebase
    .firestore()
    .collection("supplies")
    .doc(request.docID);

  const onChecked = () => {
    const data = {
      received: receivedChecked,
      delivered: deliveredChecked,
      unavailable: unavailableChecked,
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

  const [RequestItem, setRequestItems] = React.useState([]);

  const requestItemRef = firebase
    .firestore()
    .collection("supplies")
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
      <ScrollView style={{ backgroundColor: AppColors.background }}>
        <Appbar
          style={{
            backgroundColor: AppColors.primary,
            elevation: 0,
          }}
        >
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          {AppRenderIf(
            unavailableChecked != true && deliveredChecked != true,
            <Appbar.Content title="Request" subtitle={request.docID} />
          )}
          {AppRenderIf(
            unavailableChecked == true,
            <Appbar.Content title="Request" subtitle="Unavailable" />
          )}
          {AppRenderIf(
            deliveredChecked == true && receivedChecked != true,
            <Appbar.Content title="Request" subtitle="Delivered" />
          )}
          {AppRenderIf(
            receivedChecked == true && unavailableChecked != true,
            <Appbar.Content title="Request" subtitle="Received" />
          )}

          {AppRenderIf(
            unavailableChecked != true &&
              deliveredChecked != true &&
              request.type == "supplier",
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
                checked={deliveredChecked}
                onChange={(nextChecked) => setDeliveredChecked(nextChecked)}
              >
                Delivered
              </CheckBox>
            </View>
          )}

          {AppRenderIf(
            deliveredChecked == true && receivedChecked != true,
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
                checked={receivedChecked}
                onChange={(nextChecked) => setReceivedChecked(nextChecked)}
              >
                Received
              </CheckBox>
            </View>
          )}

          {AppRenderIf(
            unavailableChecked != true &&
              deliveredChecked != true &&
              request.type == "supplier",
            <View
              style={{
                borderRadius: 4,
                margin: 2,
                padding: 6,
                backgroundColor: AppColors.red,
              }}
            >
              <CheckBox
                style={{ margin: 2 }}
                status="control"
                checked={unavailableChecked}
                onChange={(nextChecked) => setUnavailableChecked(nextChecked)}
              >
                Unavailable
              </CheckBox>
            </View>
          )}

          {AppRenderIf(
            request.type == "admin",
            <Appbar.Action
              icon="trash-can-outline"
              onPress={showConfirmation}
            />
          )}
          {AppRenderIf(
            deliveredChecked == true ||
              (unavailableChecked == true && request.type == "supplier"),
            <Appbar.Action
              icon="refresh"
              onPress={() => {
                setReceivedChecked(false);
                setDeliveredChecked(false);
                setUnavailableChecked(false);
              }}
            />
          )}
          {AppRenderIf(
            request.type == "supplier",
            <Appbar.Action icon="check-all" onPress={onChecked} />
          )}
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
              <Caption>Supply Request : {request.docID}</Caption>
              <Caption>Required Date : {request.requiredDate}</Caption>
              <Caption>Supplier : {request.supplier}</Caption>
            </View>
          </View>
          <Divider />
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
                  <DataTable.Cell numeric>Rs.{item.stockPrice}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    Rs.{item.stockPrice * item.quantity}
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

export default AppSupply;
