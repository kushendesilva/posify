import React, { useEffect } from "react";
import { View } from "react-native";
import { Input, Button, Icon, Text, Card } from "@ui-kitten/components";
import Screen from "../components/Screen";
import { firebase } from "../configs/Database";

function AppReport(props) {
  const SaveIcon = (props) => (
    <Icon {...props} name="checkmark-circle-outline" />
  );
  const CalIcon = (props) => <Icon {...props} name="calendar-outline" />;

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
    <Screen>
      <Card
        status="primary"
        style={{
          marginTop: "5%",
          marginHorizontal: "10%",
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
            {getCurrentDate()}
          </Text>
        </Text>
        <View
          style={{
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
      <View style={{ marginHorizontal: "10%", marginTop: "5%" }}>
        <Input
          style={{ marginHorizontal: "2%", marginBottom: "1%" }}
          size="large"
          status="primary"
          value={date}
          label="Day"
          placeholder="Type the Day"
          accessoryLeft={CalIcon}
          onChangeText={(text) => setDate(text)}
          keyboardType="number-pad"
        />
        <Input
          style={{ marginHorizontal: "2%", marginVertical: "1%" }}
          size="large"
          status="primary"
          value={month}
          label="Month"
          placeholder="Type the Month"
          accessoryLeft={CalIcon}
          onChangeText={(text) => setMonth(text)}
          keyboardType="number-pad"
        />
        <Input
          style={{ marginHorizontal: "2%", marginVertical: "1%" }}
          size="large"
          status="primary"
          value={year}
          label="Year"
          placeholder="Type the Year"
          accessoryLeft={CalIcon}
          onChangeText={(text) => setYear(text)}
          keyboardType="number-pad"
        />
        <Button
          style={{ padding: "5%", marginTop: "5%" }}
          accessoryRight={SaveIcon}
          size="giant"
          onPress={(values) => {
            props.navigation.navigate("ReportExport", {
              selectedDate: {
                date: parseInt(date, 10),
                month: parseInt(month, 10),
                year: parseInt(year, 10),
              },
            });
          }}
        >
          Submit
        </Button>
      </View>
    </Screen>
  );
}

export default AppReport;
