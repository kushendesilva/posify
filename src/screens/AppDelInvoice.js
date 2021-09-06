import React from "react";
import { View } from "react-native";
import {
  Caption,
  Portal,
  Provider,
  Button,
  Paragraph,
  Dialog,
} from "react-native-paper";
import AppColors from "../configs/AppColors";
import { firebase } from "../configs/Database";

function AppDelInvoice({ route, navigation }) {
  const { invoice } = route.params;

  const [visible, setVisible] = React.useState(false);

  const showConfirmation = () => setVisible(true);

  const hideConfirmation = () => setVisible(false);

  const onDeleteButtonPress = () => {
    firebase
      .firestore()
      .collection("invoices")
      .doc(invoice.docID)
      .delete()
      .then(
        () => {
          hideConfirmation();
          navigation.goBack();
        },
        function (error) {
          // An error happened.
        }
      );
  };

  return (
    <Provider>
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <View
          style={{
            borderColor: AppColors.red,
            borderStyle: "solid",
            borderRadius: 10,
            borderWidth: 2,
            padding: "5%",
            width: "90%",
            backgroundColor: AppColors.background,
            alignItems: "stretch",
          }}
        >
          <Caption
            style={{
              textAlign: "center",
              fontSize: 16,
              marginBottom: "5%",
            }}
          >
            Invoice:{" "}
            <Caption
              style={{
                textAlign: "center",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              #{invoice.docID}
            </Caption>
          </Caption>
          <Button
            style={{ padding: "2%" }}
            mode="contained"
            color={AppColors.red}
            onPress={hideConfirmation}
            icon="trash-can-outline"
            onPress={showConfirmation}
          >
            Delete
          </Button>
        </View>
        <Portal>
          <Dialog visible={visible} onDismiss={hideConfirmation}>
            <Dialog.Title>Confirmation</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Confirm Removing Invoice {invoice.docID}</Paragraph>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
              <Button
                mode="contained"
                color={AppColors.red}
                onPress={hideConfirmation}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                color={AppColors.secondaryVariant}
                onPress={() => {
                  onDeleteButtonPress();
                }}
              >
                Confirm
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </Provider>
  );
}

export default AppDelInvoice;
