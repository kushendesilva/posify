import React from "react";
import { View } from "react-native";
import { Text, Card } from "@ui-kitten/components";
import Screen from "../components/Screen";
import { firebase } from "../configs/Database";

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
    <Screen>
      <Card
        status="primary"
        style={{
          marginVertical: "2%",
          marginHorizontal: "15%",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
          }}
        >
          Date:{" "}
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {getDate()}
          </Text>
        </Text>
        <View
          style={{
            marginTop: "5%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              marginHorizontal: "2%",
            }}
          >
            Incomes:{" "}
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Rs.{totalPrice}
            </Text>
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              marginHorizontal: "2%",
            }}
          >
            Expenses:{" "}
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Rs.{totalStock}
            </Text>
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 16,
              marginHorizontal: "2%",
            }}
          >
            Profit:{" "}
            <Text
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              Rs.{totalPrice - totalStock}
            </Text>
          </Text>
        </View>
      </Card>
    </Screen>
  );
}

export default AppReportExport;
