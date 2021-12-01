import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
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
import { Button, Icon, Calendar, Text } from "@ui-kitten/components";
import AppColors from "../configs/AppColors";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";

function AppAddSupplies({ navigation, route }) {
  const AddIcon = (props) => <Icon {...props} name="plus-outline" />;

  const { request } = route.params;

  const [quantity, setQuantity] = React.useState(0);
  const [itemName, setItemName] = React.useState("");
  const [unitPrice, setunitPrice] = React.useState(0);
  const [stockPrice, setStockPrice] = React.useState(0);
  const onChangeSearch = (query) => setSearchQuery(query);
  const [searchQuery, setSearchQuery] = React.useState("");

  const inventoryRef = firebase
    .firestore()
    .collection("supplies")
    .doc(request.requestID)
    .collection("invItems");

  const createRequest = () => {
    {
      const data = {
        itemName: itemName,
        quantity: parseInt(quantity),
        stockPrice: parseFloat(stockPrice),
      };
      inventoryRef
        .add(data)
        .then((_doc) => {})
        .catch((error) => {
          alert(error);
        });
    }
  };

  const supplyRef = firebase.firestore().collection("supplies");

  const updateRequest = () => {
    {
      const data = { supplier: request.name };
      supplyRef
        .doc(request.requestID)
        .update(data)
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

  const [visibleSnack, setVisibleSnack] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);

  const onDismissSnackBar = () => setVisibleSnack(false);

  return (
    <View>
      <Appbar style={{ backgroundColor: AppColors.primary }}>
        <Appbar.BackAction onPress={(values) => navigation.goBack()} />
        <Appbar.Content title="Supply Request" subtitle={request.name} />
        <Snackbar
          duration={400}
          visible={visibleSnack}
          onDismiss={onDismissSnackBar}
        >
          Added Successfully
        </Snackbar>
        <Appbar.Action
          onPress={() => {
            updateRequest();
            navigation.navigate("AppSupplies");
          }}
          icon="arrow-collapse-right"
        />
      </Appbar>

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
              <DataTable.Row>
                <DataTable.Cell style={{ justifyContent: "center" }}>
                  {item.itemName}
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell style={{ justifyContent: "center" }}>
                  Price: Rs.
                  {item.stockPrice}
                </DataTable.Cell>
                <DataTable.Cell
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TextInput
                    placeholder={"Quantity"}
                    mode="outlined"
                    keyboardType="number-pad"
                    style={{
                      backgroundColor: AppColors.background,
                      height: 25,
                    }}
                    onChangeText={(text) => {
                      setQuantity(text),
                        setItemName(item.itemName),
                        setStockPrice(item.stockPrice);
                    }}
                  ></TextInput>
                </DataTable.Cell>
                <DataTable.Cell style={{ justifyContent: "center" }}>
                  <Button
                    status="primary"
                    size="small"
                    accessoryRight={AddIcon}
                    onPress={() => {
                      createRequest();
                      onToggleSnackBar();
                    }}
                  >
                    Add
                  </Button>
                </DataTable.Cell>
              </DataTable.Row>
            </>
          )}
        />
      </DataTable>
    </View>
  );
}

export default AppAddSupplies;

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
