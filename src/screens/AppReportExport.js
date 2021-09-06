import React from "react";
import { View, StyleSheet } from "react-native";
import { Title } from "react-native-paper";

import { firebase } from "../configs/Database";
import AppColors from "../configs/AppColors";

function AppReportExport({ navigation, route }) {
  const { selectedDate } = route.params;
  const [InvoiceItem, setInvoiceItems] = React.useState([]);

  const getDate = () => {
    var date = selectedDate.date;
    var month = selectedDate.month;
    var year = selectedDate.year;
    return date + "/" + month + "/" + year;
  };

  let totalStock = 0;
  let totalPrice = 0;

  InvoiceItem.forEach((item) => {
    totalPrice += item.total;
    totalStock += item.stockPrice;
  });

  const invoiceItemRef = firebase
    .firestore()
    .collection("invoices")
    .where("date", "==", getDate());

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
            {getDate()}
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
    </View>
  );
}

export default AppReportExport;

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center" },
});
