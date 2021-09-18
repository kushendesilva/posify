import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Appbar,
  Portal,
  Dialog,
  Provider,
} from "react-native-paper";
import AppColors from "../configs/AppColors";
import { firebase } from "../configs/Database";
import Screen from "../components/Screen";
import AppRenderIf from "../configs/AppRenderIf";
import { Icon, Button, Input, Text } from "@ui-kitten/components";

function AppEditStock({ navigation, route }) {
  const EditIcon = (props) => <Icon {...props} name="edit-2-outline" />;
  const CancelIcon = (props) => <Icon {...props} name="slash-outline" />;
  const SaveIcon = (props) => <Icon {...props} name="save-outline" />;
  const DelIcon = (props) => <Icon {...props} name="trash-2-outline" />;
  const CheckIcon = (props) => (
    <Icon {...props} name="checkmark-circle-outline" />
  );

  const { stockItem } = route.params;

  const [itemName, setItemName] = React.useState(stockItem.itemName);
  const [stockPrice, setStockPrice] = React.useState(stockItem.stockPrice);
  const [unitPriceA, setUnitPriceA] = React.useState(stockItem.unitPriceA);
  const [unitPriceB, setUnitPriceB] = React.useState(stockItem.unitPriceB);
  const [unitPriceC, setUnitPriceC] = React.useState(stockItem.unitPriceC);
  const [stock, setStock] = React.useState(stockItem.stock);

  const [visible, setVisible] = React.useState(false);

  const showConfirmation = () => setVisible(true);

  const hideConfirmation = () => setVisible(false);

  const entityRef = firebase
    .firestore()
    .collection("stockItems")
    .doc(stockItem.id);

  const onEditButtonPress = () => {
    if (
      itemName &&
      itemName.length > 0 &&
      stockPrice &&
      stockPrice.length > 0 &&
      unitPriceA &&
      unitPriceA.length > 0 &&
      unitPriceB &&
      unitPriceB.length > 0 &&
      unitPriceC &&
      unitPriceC.length > 0 &&
      stock &&
      stock.length > 0
    ) {
      const data = {
        itemName: itemName,
        stock: stock,
        stockPrice: stockPrice,
        unitPriceA: unitPriceA,
        unitPriceB: unitPriceB,
        unitPriceC: unitPriceC,
      };
      entityRef
        .set(data)
        .then((_doc) => {
          setItemName("");
          navigation.goBack();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const onDeleteButtonPress = () => {
    firebase
      .firestore()
      .collection("stockItems")
      .doc(stockItem.id)
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

  const [visibility, setVisibility] = useState(true);

  return (
    <Provider>
      <Screen>
        <Appbar style={{ backgroundColor: AppColors.primary }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content
            title="Edit Stock Items"
            subtitle={stockItem.itemName}
          />
        </Appbar>
        <View style={styles.containers}>
          <Input
            label="Item Name"
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="primary"
            onChangeText={(text) => setItemName(text)}
            value={itemName}
            disabled={visibility}
          />
          <Input
            label="Wholesale Price"
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="primary"
            onChangeText={(text) => setStockPrice(text)}
            value={stockPrice}
            keyboardType="number-pad"
            disabled={visibility}
          />
          <Input
            label="Unit Price - Category A"
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="primary"
            onChangeText={(text) => setUnitPriceA(text)}
            value={unitPriceA}
            keyboardType="number-pad"
            disabled={visibility}
          />
          <Input
            label="Unit Price - Category B"
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="primary"
            onChangeText={(text) => setUnitPriceB(text)}
            value={unitPriceB}
            keyboardType="number-pad"
            disabled={visibility}
          />
          <Input
            label="Unit Price - Category C"
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="primary"
            onChangeText={(text) => setUnitPriceC(text)}
            value={unitPriceC}
            keyboardType="number-pad"
            disabled={visibility}
          />
          <Input
            label="Stock"
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="primary"
            onChangeText={(text) => setStock(text)}
            value={stock.toString()}
            keyboardType="number-pad"
            disabled={visibility}
          />
          {AppRenderIf(
            visibility,
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: "2%",
              }}
            >
              <Button
                accessoryRight={EditIcon}
                status="warning"
                size="giant"
                onPress={() => {
                  setVisibility(!visibility);
                }}
              >
                Edit
              </Button>

              <Button
                accessoryRight={DelIcon}
                status="danger"
                size="giant"
                onPress={showConfirmation}
              >
                Delete
              </Button>
            </View>
          )}
          {AppRenderIf(
            !visibility,
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                marginTop: "2%",
              }}
            >
              <Button
                accessoryRight={CancelIcon}
                status="danger"
                size="giant"
                onPress={() => {
                  setVisibility(!visibility);
                }}
              >
                Cancel
              </Button>
              <Button
                accessoryRight={SaveIcon}
                status="success"
                size="giant"
                onPress={() => {
                  onEditButtonPress();
                }}
              >
                Update
              </Button>
            </View>
          )}
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideConfirmation}>
            <Dialog.Title>
              <Text category="h6" style={{ fontWeight: "bold" }}>
                Confirmation
              </Text>
            </Dialog.Title>
            <Dialog.Content>
              <Text category="label">Remove Item {stockItem.itemName}.</Text>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
              <Button
                accessoryRight={CancelIcon}
                status="danger"
                onPress={hideConfirmation}
              >
                Cancel
              </Button>
              <Button
                accessoryRight={CheckIcon}
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
      </Screen>
    </Provider>
  );
}

const styles = StyleSheet.create({
  containers: {
    padding: 10,
  },
  ContainerButton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  containerHeading: {
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: AppColors.background,
    padding: "5%",
    shadowColor: AppColors.primaryVariant,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 15,
  },
  containerTop: {
    alignItems: "center",
    marginTop: 5,
  },
  fixToText: {
    flexDirection: "row",
    justifyContent: "center",
  },
  HeadingFont: {
    fontWeight: "bold",
  },
});

export default AppEditStock;
