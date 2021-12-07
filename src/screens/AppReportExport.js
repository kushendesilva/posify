import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Card, Layout, Text, Divider } from "@ui-kitten/components";
import Screen from "../components/Screen";
import { firebase } from "../configs/Database";
import AppRenderIf from "../configs/AppRenderIf";
import AppColors from "../configs/AppColors";
import { PieChart } from "react-native-chart-kit";

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

  const data = [
    {
      name: "INCOME",
      population: parseInt(totalPrice),
      color: AppColors.green,
      legendFontColor: "#7F7F7F",
      legendFontSize: 13,
    },
    {
      name: "EXPENSES",
      population: parseInt(totalStock),
      color: AppColors.red,
      legendFontColor: "#7F7F7F",
      legendFontSize: 13,
    },
  ];

  const Header = (props) => (
    <View {...props}>
      <Text category="h6" style={{ fontWeight: "bold" }}>
        Daily Report
      </Text>
      <Text category="s1">Income & Expense Report</Text>
    </View>
  );

  const Footer = (props) => (
    <View {...props} style={[props.style, styles.footerContainer]}>
      <PieChart
        data={data}
        width={400}
        height={220}
        chartConfig={{
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor={"population"}
      />
    </View>
  );

  return (
    <Screen>
      <React.Fragment>
        <Card style={styles.card} header={Header} footer={Footer}>
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
              {getDate()}
            </Text>
          </Text>
          <Divider style={{ marginVertical: "5%" }} />
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
          <Divider style={{ marginVertical: "5%" }} />
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
        </Card>
      </React.Fragment>
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
    margin: 2,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  footerControl: {
    marginHorizontal: 2,
  },
});

export default AppReportExport;
