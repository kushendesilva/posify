import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  StatusBar,
  FlatList,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { Icon, Card, Text, Layout } from "@ui-kitten/components";
import { firebase } from "../configs/Database";

import AppColors from "../configs/AppColors";

function AppSelectSupplier({ navigation, route }) {
  const { date } = route.params;

  const [supplier, setSupplier] = useState([]);

  const requestID = Date.now().toString();

  const supplierRef = firebase
    .firestore()
    .collection("users")
    .where("type", "==", "supplier");

  useEffect(() => {
    supplierRef.onSnapshot(
      (querySnapshot) => {
        const newSuppliers = [];
        querySnapshot.forEach((doc) => {
          const supplier = doc.data();
          supplier.id = doc.id;
          newSuppliers.push(supplier);
        });
        setSupplier(newSuppliers);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  //create request
  const supplyRef = firebase.firestore().collection("supplies");

  const createRequest = () => {
    {
      const data = {
        requestID,
        requiredDate: date,
        unavailable: false,
        delivered: false,
        received: false,
      };
      supplyRef
        .doc(requestID)
        .set(data)
        .catch((error) => {
          alert(error);
        });
    }
  };

  //search
  const [search, setSearch] = useState("");
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  React.useEffect(() => {
    supplierRef.onSnapshot(
      (querySnapshot) => {
        const newStock = [];
        querySnapshot.forEach((doc) => {
          const supplier = doc.data();
          supplier.id = doc.id;
          newStock.push(supplier);
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
        const itemData = item.fullName
          ? item.fullName.toUpperCase()
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
    <View style={styles.container}>
      <StatusBar backgroundColor={AppColors.primary} barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.text}>Select the Supplier</Text>
      </View>
      <Searchbar
        style={{
          marginTop: "1%",
          marginBottom: "5%",
          borderRadius: 10,
          marginLeft: "6%",
          marginRight: "6%",
        }}
        onChangeText={(text) => searchFilterFunction(text)}
        onClear={(text) => searchFilterFunction("")}
        placeholder="Search"
        value={search}
      />
      <Layout style={styles.footer}>
        <View>
          <FlatList
            data={filteredDataSource}
            keyExtractor={(supplier) => supplier.id.toString()}
            renderItem={({ item }) => (
              <Card
                status="primary"
                style={{
                  marginVertical: "2%",
                  marginHorizontal: "15%",
                }}
                onPress={(values) => {
                  createRequest(),
                    navigation.navigate("AppAddSupplies", {
                      request: {
                        name: item.fullName,
                        requestID: requestID,
                      },
                    });
                }}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Icon
                    style={{ width: 30, height: 30 }}
                    fill={AppColors.primary}
                    name="home-outline"
                  />
                  <Text
                    category="h6"
                    style={{ fontWeight: "bold", margin: "2%" }}
                  >
                    {item.fullName}
                  </Text>
                  <Text category="label">{item.email}</Text>
                </View>
              </Card>
            )}
          />
        </View>
      </Layout>
    </View>
  );
}

export default AppSelectSupplier;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.primary,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  footer: {
    flex: 4,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: "5%",
    justifyContent: "center",
  },
  innerFooter: { padding: "4%", marginTop: "5%" },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  button: {
    padding: "4%",
    marginTop: "5%",
  },
  forget: {
    color: AppColors.primaryVariant,
    fontSize: 16,
    marginTop: "3%",
    alignSelf: "center",
  },
  text: {
    textAlign: "center",
    color: AppColors.background,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
  },
});
