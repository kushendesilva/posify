import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import {
  Input,
  Button,
  Icon,
  Text,
  Card,
  Layout,
  Divider,
} from "@ui-kitten/components";
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
      <Card style={styles.card} disabled>
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
          }}
        >
          DATE:{" "}
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {getCurrentDate()}
          </Text>
        </Text>
        <Divider style={{ marginVertical: "0.5%" }} />
        <Layout
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Text
            style={{
              fontSize: 16,
              marginHorizontal: "2%",
            }}
          >
            TOTAL INCOME:{" "}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Rs. {totalPrice}.00
          </Text>
        </Layout>
        <Layout
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Text
            style={{
              fontSize: 16,
              marginHorizontal: "2%",
            }}
          >
            TOTAL EXPENSES:{" "}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Rs. {totalStock}.00
          </Text>
        </Layout>
        <Divider style={{ marginVertical: "0.5%" }} />
        <Layout
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Text
            style={{
              fontSize: 16,
              marginHorizontal: "2%",
            }}
          >
            NET PROFIT / LOSS:{" "}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Rs. {Math.abs(totalPrice - totalStock)}.00
          </Text>
        </Layout>
        <Layout
          style={{ flexDirection: "row", justifyContent: "space-between" }}
        >
          <Text
            style={{
              fontSize: 16,
              marginHorizontal: "2%",
            }}
          >
            PROFIT / LOSS PERCENTAGE(%):{" "}
          </Text>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {Math.abs(((totalPrice - totalStock) / totalStock) * 100)} %
          </Text>
        </Layout>
        <Divider style={{ marginVertical: "0.5%" }} />
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: "2%",
          }}
        >
          <Input
            style={{
              marginHorizontal: "2%",
              marginBottom: "1%",
              width: "30%",
            }}
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
            style={{
              marginHorizontal: "2%",
              marginBottom: "1%",
              width: "30%",
            }}
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
            style={{
              marginHorizontal: "2%",
              marginBottom: "2%",
              width: "30%",
            }}
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
            style={{ padding: "4%", width: "30%" }}
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
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
  },
});

export default AppReport;
