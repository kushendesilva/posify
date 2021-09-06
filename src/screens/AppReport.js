import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Title, TextInput, Button } from "react-native-paper";
import AppColors from "../configs/AppColors";
import { firebase } from "../configs/Database";

function AppReport(props) {
  const [InvoiceItem, setInvoiceItems] = React.useState([]);
  const [date, setDate] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [year, setYear] = React.useState("");

  let totalStock = 0;
  let totalPrice = 0;

  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    return date + "/" + month + "/" + year;
  };

  InvoiceItem.forEach((item) => {
    totalPrice += item.total;
    totalStock += item.stockPrice;
  });

  const invoiceItemRef = firebase
    .firestore()
    .collection("invoices")
    .where("date", "==", getCurrentDate());

  useEffect(() => {
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

  return (
    <View style={styles.screen}>
      <View
        style={{
          borderColor: AppColors.primary,
          borderWidth: 2,
          borderStyle: "solid",
          borderRadius: 10,
          alignSelf: "center",
          padding: "2%",
          backgroundColor: AppColors.background,
          marginTop: "2%",
        }}
      >
        <Title
          style={{
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Date:{" "}
          <Title
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {getCurrentDate()}
          </Title>
        </Title>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Title
            style={{
              textAlign: "center",
              fontSize: 16,
              marginHorizontal: "2%",
            }}
          >
            Incomes:{" "}
            <Title
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Rs.{totalPrice}
            </Title>
          </Title>
          <Title
            style={{
              textAlign: "center",
              fontSize: 16,
              marginHorizontal: "2%",
            }}
          >
            Expenses:{" "}
            <Title
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Rs.{totalStock}
            </Title>
          </Title>
          <Title
            style={{
              textAlign: "center",
              fontSize: 16,
              marginHorizontal: "2%",
            }}
          >
            Profit:{" "}
            <Title
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Rs.{totalPrice - totalStock}
            </Title>
          </Title>
        </View>
      </View>
      <View style={{ marginHorizontal: "10%", marginTop: "5%" }}>
        <TextInput
          placeholder="Day"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          mode="outlined"
          onChangeText={(text) => setDate(text)}
          value={date}
          keyboardType="number-pad"
        />
        <TextInput
          placeholder="Month"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          mode="outlined"
          onChangeText={(text) => setMonth(text)}
          value={month}
          keyboardType="number-pad"
        />
        <TextInput
          placeholder="Year"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          mode="outlined"
          onChangeText={(text) => setYear(text)}
          value={year}
          keyboardType="number-pad"
        />
        <Button
          style={{ padding: "5%", marginTop: "2%" }}
          mode="contained"
          icon="check-circle"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          onPress={(values) => {
            props.navigation.navigate("ReportExport", {
              selectedDate: {
                date: date,
                month: month,
                year: year,
              },
            });
          }}
        >
          Submit
        </Button>
      </View>
    </View>
  );
}

export default AppReport;

const styles = StyleSheet.create({
  screen: { flex: 1 },
});