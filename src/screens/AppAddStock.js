import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import {
  Button,
  TextInput,
  Dialog,
  Portal,
  Paragraph,
  Provider,
  Snackbar,
} from "react-native-paper";
import { firebase } from "../configs/Database";
import AppColors from "../configs/AppColors";

function AppAddStock(props) {
  const [visibleSnack, setVisibleSnack] = React.useState(false);

  const onToggleSnackBar = () => setVisibleSnack(!visibleSnack);

  const onDismissSnackBar = () => setVisibleSnack(false);

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [itemName, setItemName] = React.useState("");
  const [stockPrice, setStockPrice] = React.useState("");
  const [unitPriceA, setUnitPriceA] = React.useState("");
  const [unitPriceB, setUnitPriceB] = React.useState("");
  const [unitPriceC, setUnitPriceC] = React.useState("");
  const [stock, setStock] = React.useState("");

  const stockRef = firebase.firestore().collection("stockItems");

  const onAddButtonPress = () => {
    if (itemName && itemName.length > 0) {
      const data = {
        itemName: itemName,
        stockPrice: stockPrice,
        unitPriceA: unitPriceA,
        unitPriceB: unitPriceB,
        unitPriceC: unitPriceC,
        stock: stock,
      };
      stockRef
        .add(data)
        .then((_doc) => {
          setItemName("");
          props.navigation.goBack();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <StatusBar
          backgroundColor={AppColors.primary}
          barStyle="light-content"
        />

        <ScrollView style={{ marginTop: "3%" }}>
          <TextInput
            placeholder="Stock Name"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setItemName(text)}
            value={itemName}
            left={<TextInput.Icon name="package-variant" />}
          />
          <TextInput
            placeholder="Wholesale Price"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setStockPrice(text)}
            value={stockPrice}
            keyboardType="number-pad"
            left={<TextInput.Icon name="cash" />}
          />
          <TextInput
            placeholder="Unit Price - Category A"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setUnitPriceA(text)}
            value={unitPriceA}
            keyboardType="number-pad"
            left={<TextInput.Icon name="alpha-a-box-outline" />}
          />
          <TextInput
            placeholder="Unit Price - Category B"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setUnitPriceB(text)}
            value={unitPriceB}
            keyboardType="number-pad"
            left={<TextInput.Icon name="alpha-b-box-outline" />}
          />
          <TextInput
            placeholder="Unit Price - Category C"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setUnitPriceC(text)}
            value={unitPriceC}
            keyboardType="number-pad"
            left={<TextInput.Icon name="alpha-c-box-outline" />}
          />
          <TextInput
            placeholder="Stock"
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            mode="outlined"
            onChangeText={(text) => setStock(text)}
            value={stock}
            keyboardType="number-pad"
            left={<TextInput.Icon name="numeric-9-plus-box-multiple-outline" />}
          />
        </ScrollView>

        <Button
          mode="contained"
          icon="check-circle"
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          style={styles.button}
          onPress={showDialog}
        >
          Submit
        </Button>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Notice</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Confirmation</Paragraph>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
              <Button
                mode="contained"
                color={AppColors.red}
                onPress={hideDialog}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                color={AppColors.secondaryVariant}
                onPress={() => {
                  hideDialog();
                  onToggleSnackBar();
                  onAddButtonPress();
                }}
              >
                Confirm
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <Snackbar
          visible={visibleSnack}
          onDismiss={onDismissSnackBar}
          action={{
            label: "Okay",
            onPress: () => {
              onDismissSnackBar();
              props.navigation.goBack();
            },
          }}
        >
          Successful
        </Snackbar>
      </View>
    </Provider>
  );
}

const { height } = Dimensions.get("screen");
const height_logo = height * 0.15;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
    justifyContent: "center",
    paddingHorizontal: "5%",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  innerFooter: { padding: "4%", marginTop: "5%" },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  button: {
    padding: "4%",
    marginVertical: "3%",
  },
  text: {
    color: AppColors.primary,
    fontSize: 25,
    fontWeight: "bold",
    alignSelf: "center",
  },
});

export default AppAddStock;
