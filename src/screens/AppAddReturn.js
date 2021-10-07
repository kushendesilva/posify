import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import {
  Snackbar,
  TextInput,
  Title,
  Text,
  Appbar,
  Divider,
  DataTable,
  Searchbar,
} from "react-native-paper";
import { Button, Icon } from "@ui-kitten/components";
import AppColors from "../configs/AppColors";
import Screen from "../components/Screen";
import { firebase } from "../configs/Database";

function AppAddReturns({ navigation, route }) {
  const [StockItems, setStockItems] = React.useState([]);
  const AddIcon = (props) => <Icon {...props} name="plus-outline" />;

  const stockRef = firebase.firestore().collection("stockItems");

  React.useEffect(() => {
    stockRef.onSnapshot(
      (querySnapshot) => {
        const newStock = [];
        querySnapshot.forEach((doc) => {
          const shop = doc.data();
          shop.id = doc.id;
          newStock.push(shop);
        });
        setStockItems(newStock);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const { shop } = route.params;
  const [quantity, setQuantity] = React.useState(0);
  const [itemName, setItemName] = React.useState("");
  const [unitPrice, setunitPrice] = React.useState(0);
  const [InvoiceItem, setInvoiceItems] = React.useState([]);
  const [Invoice, setInvoice] = React.useState([]);

  let totalStock = 0;
  let totalPrice = 0;
  InvoiceItem.forEach((item) => {
    totalPrice += item.unitPrice * item.quantity;
    totalStock += item.stockPrice * item.quantity;
  });

  const invoiceItemRef = firebase
    .firestore()
    .collection("invoices")
    .doc(shop.docID)
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

  const [visibleSnack, setVisibleSnack] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);

  const onDismissSnackBar = () => setVisibleSnack(false);

  const [visibleReSnack, setVisibleReSnack] = React.useState(false);

  const onToggleReSnackBar = () => setVisibleReSnack(!visibleReSnack);

  const onDismissReSnackBar = () => setVisibleReSnack(false);

  const onChangeSearch = (query) => setSearchQuery(query);
  const [searchQuery, setSearchQuery] = React.useState("");
  // const [returns, setReturns] = React.useState("0");

  const dbRef = firebase.firestore();

  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    return date + "/" + month + "/" + year;
  };

  const addReturns = () => {
    {
      const data = {
        payMethod: shop.payMethod,
        shopName: shop.name,
        invoiceID: shop.docID,
        date: getCurrentDate(),
        stockPrice: totalStock,
        total: totalPrice,
        returns: totalReturns,
      };
      dbRef
        .collection("invoices")
        .doc(shop.docID)
        .set(data)
        .catch((error) => {
          alert(error);
        });
    }
  };

  let totalReturns = 0;
  Invoice.forEach((item) => {
    totalReturns += item.unitPrice * item.quantity;
  });

  const invoiceRef = firebase
    .firestore()
    .collection("invoices")
    .doc(shop.docID)
    .collection("returnItems");

  React.useEffect(() => {
    invoiceRef.onSnapshot(
      (querySnapshot) => {
        const newInvoice = [];
        querySnapshot.forEach((doc) => {
          const invoice = doc.data();
          invoice.id = doc.id;
          newInvoice.push(invoice);
        });
        setInvoice(newInvoice);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const createInvoice = () => {
    {
      //      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      //    const invoiceid = Date.now();
      const data = {
        itemName: itemName,
        quantity: parseInt(quantity),
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
    // Check if searched text is not blank
    if (text) {
      // Inserted text is not blank
      // Filter the masterDataSource
      // Update FilteredDataSource
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
      // Inserted text is blank
      // Update FilteredDataSource with masterDataSource
      setFilteredDataSource(masterDataSource);
      setSearch(text);
    }
  };

  return (
    <Screen>
      <Appbar style={{ backgroundColor: AppColors.primary }}>
        <Appbar.BackAction onPress={(values) => navigation.goBack()} />
        <Appbar.Content title="Returns" subtitle={shop.name} />
        <Appbar.Action
          onPress={(values) => {
            onToggleSnackBar();
            addReturns();
            navigation.navigate("AppHome");
          }}
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
          <Title style={{ marginLeft: "5%", fontSize: 12 }}>Total: </Title>
          <Text>Rs.{totalPrice}</Text>
        </View>
        <Divider style={{ marginLeft: "2%", width: 1, height: "100%" }} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Title style={{ marginLeft: "5%", fontSize: 12 }}>Returns:</Title>
          <Text> Rs.{totalReturns}</Text>
        </View>
        <Snackbar
          duration={500}
          visible={visibleReSnack}
          onDismiss={onDismissReSnackBar}
        >
          Successful
        </Snackbar>
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
          style={{ marginBottom: "53%" }}
          data={filteredDataSource}
          keyExtractor={(invoiceItem) => invoiceItem.id.toString()}
          renderItem={({ item, index }) => (
            <>
              <DataTable.Row>
                <DataTable.Cell style={{ justifyContent: "center" }}>
                  {item.itemName}
                </DataTable.Cell>
              </DataTable.Row>

              <DataTable.Row>
                <DataTable.Cell
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TextInput
                    placeholder={"Unit Price"}
                    mode="outlined"
                    onChangeText={(text) => {
                      setunitPrice(text);
                    }}
                    keyboardType="number-pad"
                    style={{
                      backgroundColor: AppColors.background,
                      height: 25,
                    }}
                  ></TextInput>
                </DataTable.Cell>
                <DataTable.Cell
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <TextInput
                    placeholder={"Quantity"}
                    mode="outlined"
                    onChangeText={(text) => {
                      setQuantity(text), setItemName(item.itemName);
                    }}
                    keyboardType="number-pad"
                    style={{
                      backgroundColor: AppColors.background,
                      height: 25,
                    }}
                  ></TextInput>
                </DataTable.Cell>
                <DataTable.Cell style={{ justifyContent: "center" }}>
                  <Button
                    status="primary"
                    size="small"
                    accessoryRight={AddIcon}
                    onPress={() => {
                      createInvoice();
                      onToggleReSnackBar();
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
      {/* <TextInput
        placeholder="Returns (Rs)"
        mode="outlined"
        onChangeText={(text) => setReturns(text)}
        value={returns}
        keyboardType="number-pad"
        style={{ width: "60%", alignSelf: "center" }}
      ></TextInput> */}
      <Snackbar
        duration={500}
        visible={visibleSnack}
        onDismiss={onDismissSnackBar}
      >
        Successful
      </Snackbar>
    </Screen>
  );
}

export default AppAddReturns;

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
