import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  Portal,
  Dialog,
  Provider,
  Paragraph,
} from "react-native-paper";
import AppColors from "../configs/AppColors";
import { firebase } from "../configs/Database";

import AppRenderIf from "../configs/AppRenderIf";

function AppEditStock({ navigation, route }) {
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
      <View style={styles.screen}>
        <Appbar style={{ backgroundColor: AppColors.primary }}>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content
            title="Edit Stock Items"
            subtitle={stockItem.itemName}
          />
        </Appbar>
        <View style={styles.containers}>
          <TextInput
            label="Item Name"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setItemName(text)}
            value={itemName}
            disabled={visibility}
            left={<TextInput.Icon name="package-variant" />}
          />
          <TextInput
            label="Wholesale Price"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setStockPrice(text)}
            value={stockPrice}
            keyboardType="number-pad"
            disabled={visibility}
            left={<TextInput.Icon name="cash" />}
          />
          <TextInput
            label="Unit Price - Category A"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setUnitPriceA(text)}
            value={unitPriceA}
            keyboardType="number-pad"
            disabled={visibility}
            left={<TextInput.Icon name="alpha-a-box-outline" />}
          />
          <TextInput
            label="Unit Price - Category B"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setUnitPriceB(text)}
            value={unitPriceB}
            keyboardType="number-pad"
            disabled={visibility}
            left={<TextInput.Icon name="alpha-b-box-outline" />}
          />
          <TextInput
            label="Unit Price - Category C"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setUnitPriceC(text)}
            value={unitPriceC}
            keyboardType="number-pad"
            disabled={visibility}
            left={<TextInput.Icon name="alpha-c-box-outline" />}
          />
          <TextInput
            label="Stock"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setStock(text)}
            value={stock.toString()}
            keyboardType="number-pad"
            disabled={visibility}
            left={<TextInput.Icon name="numeric-9-plus-box-multiple-outline" />}
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
                color={AppColors.orange}
                mode="contained"
                style={{ padding: "3%" }}
                icon="square-edit-outline"
                onPress={() => {
                  setVisibility(!visibility);
                }}
              >
                Edit
              </Button>
              <Button
                color={AppColors.red}
                style={{ padding: "3%" }}
                mode="contained"
                icon="trash-can-outline"
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
                color={AppColors.red}
                style={{ padding: "3%" }}
                mode="contained"
                icon="block-helper"
                onPress={() => {
                  setVisibility(!visibility);
                }}
              >
                Cancel
              </Button>
              <Button
                color={AppColors.secondaryVariant}
                style={{ padding: "3%" }}
                mode="contained"
                icon="content-save"
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
            <Dialog.Title>Confirmation</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Remove Item {stockItem.itemName}.</Paragraph>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
              <Button
                mode="contained"
                color={AppColors.red}
                onPress={hideConfirmation}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                color={AppColors.secondaryVariant}
                onPress={() => {
                  onDeleteButtonPress();
                }}
              >
                Confirm
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
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
