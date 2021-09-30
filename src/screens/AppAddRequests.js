import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";

import {
  DataTable,
  TextInput,
  Title,
  ToggleButton,
  Divider,
  Searchbar,
  Appbar,
  Snackbar,
} from "react-native-paper";
import { Button, Icon } from "@ui-kitten/components";
import AppColors from "../configs/AppColors";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";

function AppAddRequests({ navigation, route }) {
  const [visibleSnack, setVisibleSnack] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);

  const onDismissSnackBar = () => setVisibleSnack(false);

  const AddIcon = (props) => <Icon {...props} name="plus-outline" />;

  const { user, requestId } = route.params;

  const stockRef = firebase.firestore().collection("stockItems");
  const updateStock = () => {
    const data = {
      stock: itemStock - quantity,
      itemName: itemName,
      unitPriceA: unitPriceA,
      unitPriceB: unitPriceB,
      unitPriceC: unitPriceC,
      stockPrice: stockPrice,
    };
    stockRef
      .doc(itemID)
      .set(data)
      .then((_doc) => {
        //  navigation.goBack();
      })
      .catch((error) => {
        alert(error);
      });
  };

  const [value, setValue] = React.useState("cash");

  const [quantity, setQuantity] = React.useState(0);
  const [itemID, setItemID] = React.useState("");
  const [itemStock, setItemStock] = React.useState("");
  const [unitPriceA, setUnitPriceA] = React.useState(0);
  const [unitPriceB, setUnitPriceB] = React.useState(0);
  const [unitPriceC, setUnitPriceC] = React.useState(0);
  const [itemName, setItemName] = React.useState("");
  const [unitPrice, setunitPrice] = React.useState(0);
  const [stockPrice, setStockPrice] = React.useState(0);
  const onChangeSearch = (query) => setSearchQuery(query);
  const [searchQuery, setSearchQuery] = React.useState("");

  const invoiceRef = firebase
    .firestore()
    .collection("requests")
    .doc(requestId)
    .collection("invItems");

  const createInvoice = () => {
    {
      const data = {
        itemName: itemName,
        quantity: parseInt(quantity),
        stockPrice: parseFloat(stockPrice),
        unitPrice: parseFloat(unitPrice),
      };
      invoiceRef
        .add(data)
        .then((_doc) => {})
        .catch((error) => {
          alert(error);
        });
    }
  };

  //search
  const stockInvoiceRef = firebase.firestore().collection("stockItems");
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  React.useEffect(() => {
    stockInvoiceRef.onSnapshot(
      (querySnapshot) => {
        const newStock = [];
        querySnapshot.forEach((doc) => {
          const shop = doc.data();
          shop.id = doc.id;
          newStock.push(shop);
        });
        setFilteredDataSource(newStock), setMasterDataSource(newStock);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.itemName
          ? item.itemName.toUpperCase()
          : "".toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
      setSearch(text);
    } else {
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  return (
    <View>
      <Appbar style={{ backgroundColor: AppColors.primary }}>
        <Appbar.BackAction onPress={(values) => navigation.goBack()} />
        <Appbar.Content title="New Request" subtitle={user.name} />
        <Appbar.Action
          onPress={(values) => navigation.navigate("AppHome")}
          icon="arrow-collapse-right"
        />
      </Appbar>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          padding: "1%",
          margin: "1%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Title style={{ marginHorizontal: "2%", fontSize: 12 }}>
            Payment Method
          </Title>
          <Snackbar
            duration={500}
            visible={visibleSnack}
            onDismiss={onDismissSnackBar}
          >
            Successful
          </Snackbar>
          <ToggleButton.Row
            onValueChange={(value) => setValue(value)}
            value={value}
          >
            <ToggleButton icon="cash" value="cash"></ToggleButton>
            <ToggleButton icon="credit-card" value="card"></ToggleButton>
            <ToggleButton
              icon="card-text-outline"
              value="cheque"
            ></ToggleButton>
          </ToggleButton.Row>
        </View>
        <Divider style={{ marginLeft: "2%", width: 1, height: "100%" }} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></View>
      </View>
      <Divider />
      <Searchbar
        onChangeText={(text) => searchFilterFunction(text)}
        onClear={(text) => searchFilterFunction("")}
        placeholder="Search"
        value={search}
      />

      <DataTable>
        <FlatList
          data={filteredDataSource}
          //  keyExtractor={(item, index) => index.toString()}
          keyExtractor={(invoiceItem) => invoiceItem.id.toString()}
          renderItem={({ item }) => (
            <>
              {AppRenderIf(
                0 < item.stock,
                <>
                  <DataTable.Row>
                    <DataTable.Cell style={{ justifyContent: "center" }}>
                      {item.itemName}
                    </DataTable.Cell>
                  </DataTable.Row>

                  <DataTable.Row>
                    {/* <DataTable.Cell style={{justifyContent:"center"}}>{item.itemName}</DataTable.Cell> */}
                    {AppRenderIf(
                      user.category == "a",
                      <DataTable.Cell style={{ justifyContent: "center" }}>
                        Unit Price: Rs.
                        {item.unitPriceA}
                      </DataTable.Cell>
                    )}
                    {AppRenderIf(
                      user.category == "b",
                      <DataTable.Cell style={{ justifyContent: "center" }}>
                        Unit Price: Rs.
                        {item.unitPriceB}
                      </DataTable.Cell>
                    )}
                    {AppRenderIf(
                      user.category == "c",
                      <DataTable.Cell style={{ justifyContent: "center" }}>
                        Unit Price: Rs.
                        {item.unitPriceC}
                      </DataTable.Cell>
                    )}
                    <DataTable.Cell
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      {AppRenderIf(
                        user.category == "a",
                        <TextInput
                          placeholder={"Quantity: " + item.stock}
                          mode="outlined"
                          onChangeText={(text) => {
                            setQuantity(text),
                              setItemName(item.itemName),
                              setunitPrice(item.unitPriceA),
                              setStockPrice(item.stockPrice),
                              setItemID(item.id),
                              setItemStock(item.stock),
                              setUnitPriceA(item.unitPriceA),
                              setUnitPriceB(item.unitPriceB),
                              setUnitPriceC(item.unitPriceC);
                          }}
                          keyboardType="number-pad"
                          style={{
                            backgroundColor: AppColors.background,
                            height: 25,
                          }}
                        ></TextInput>
                      )}
                      {AppRenderIf(
                        user.category == "b",
                        <TextInput
                          placeholder={"Quantity: " + item.stock}
                          mode="outlined"
                          onChangeText={(text) => {
                            setQuantity(text),
                              setItemName(item.itemName),
                              setunitPrice(item.unitPriceB),
                              setStockPrice(item.stockPrice),
                              setItemID(item.id),
                              setItemStock(item.stock),
                              setUnitPriceA(item.unitPriceA),
                              setUnitPriceB(item.unitPriceB),
                              setUnitPriceC(item.unitPriceC);
                          }}
                          keyboardType="number-pad"
                          style={{
                            backgroundColor: AppColors.background,
                            height: 25,
                          }}
                        ></TextInput>
                      )}
                      {AppRenderIf(
                        user.category == "c",
                        <TextInput
                          placeholder={"Quantity: " + item.stock}
                          mode="outlined"
                          onChangeText={(text) => {
                            setQuantity(text),
                              setItemName(item.itemName),
                              setunitPrice(item.unitPriceC),
                              setStockPrice(item.stockPrice),
                              setItemID(item.id),
                              setItemStock(item.stock),
                              setUnitPriceA(item.unitPriceA),
                              setUnitPriceB(item.unitPriceB),
                              setUnitPriceC(item.unitPriceC);
                          }}
                          keyboardType="number-pad"
                          style={{
                            backgroundColor: AppColors.background,
                            height: 25,
                          }}
                        ></TextInput>
                      )}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ justifyContent: "center" }}>
                      <Button
                        status="primary"
                        size="small"
                        accessoryRight={AddIcon}
                        onPress={() => {
                          createInvoice();
                          onToggleSnackBar();
                          updateStock();
                        }}
                      >
                        Add
                      </Button>
                    </DataTable.Cell>
                  </DataTable.Row>
                </>
              )}
            </>
          )}
        />
      </DataTable>
    </View>
  );
}

export default AppAddRequests;

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: "3%",
    paddingHorizontal: "5%",
    marginHorizontal: "2%",
    elevation: 10,
    backgroundColor: AppColors.background,
    margin: "1%",
    borderRadius: 10,
    flexDirection: "row",
  },
  title: { fontSize: 16 },
});
