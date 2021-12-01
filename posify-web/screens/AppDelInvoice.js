import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Card, Modal, Text, Icon } from "@ui-kitten/components";
import Screen from "../components/Screen";
import { firebase } from "../configs/Database";

function AppDelInvoice({ route, navigation }) {
  const DelIcon = (props) => <Icon {...props} name="trash-2-outline" />;
  const CancelIcon = (props) => <Icon {...props} name="slash-outline" />;
  const CheckIcon = (props) => (
    <Icon {...props} name="checkmark-circle-outline" />
  );

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
    <Screen>
      <Card status="danger" style={{ margin: "5%" }} disabled={true}>
        <Text style={{ textAlign: "center", marginBottom: "5%" }} category="s1">
          Invoice:{" "}
          <Text
            style={{ textAlign: "center", fontWeight: "bold" }}
            category="s1"
          >
            #{invoice.docID}
          </Text>
        </Text>

        <Button
          accessoryRight={DelIcon}
          style={{ alignSelf: "center", marginTop: "2%" }}
          status="danger"
          size="medium"
          onPress={hideConfirmation}
          onPress={showConfirmation}
        >
          Delete
        </Button>
      </Card>

      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true}>
          <Text style={{ textAlign: "center", margin: "5%" }} category="h6">
            Confirm Removing Invoice {invoice.docID}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <Button
              style={{ margin: "2%" }}
              accessoryRight={CancelIcon}
              status="danger"
              size="medium"
              onPress={hideConfirmation}
            >
              Cancel
            </Button>
            <Button
              style={{ margin: "2%" }}
              accessoryRight={CheckIcon}
              status="success"
              size="medium"
              onPress={() => {
                onDeleteButtonPress();
              }}
            >
              Confirm
            </Button>
          </View>
        </Card>
      </Modal>
    </Screen>
    // <Provider>
    //   <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
    //     <View
    //       style={{
    //         borderColor: AppColors.red,
    //         borderStyle: "solid",
    //         borderRadius: 10,
    //         borderWidth: 2,
    //         padding: "5%",
    //         width: "90%",
    //         backgroundColor: AppColors.background,
    //         alignItems: "stretch",
    //       }}
    //     >
    //       <Caption
    //         style={{
    //           textAlign: "center",
    //           fontSize: 16,
    //           marginBottom: "5%",
    //         }}
    //       >
    //         Invoice:{" "}
    //         <Caption
    //           style={{
    //             textAlign: "center",
    //             fontSize: 16,
    //             fontWeight: "bold",
    //           }}
    //         >
    //           #{invoice.docID}
    //         </Caption>
    //       </Caption>
    //       <Button
    //         style={{ padding: "2%" }}
    //         mode="contained"
    //         color={AppColors.red}
    //         onPress={hideConfirmation}
    //         icon="trash-can-outline"
    //         onPress={showConfirmation}
    //       >
    //         Delete
    //       </Button>
    //     </View>
    //     <Portal>
    //       <Dialog visible={visible} onDismiss={hideConfirmation}>
    //         <Dialog.Title>Confirmation</Dialog.Title>
    //         <Dialog.Content>
    //           <Paragraph>Confirm Removing Invoice {invoice.docID}</Paragraph>
    //         </Dialog.Content>
    //         <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
    //           <Button
    //             mode="contained"
    //             color={AppColors.red}
    //             onPress={hideConfirmation}
    //           >
    //             Cancel
    //           </Button>
    //           <Button
    //             mode="contained"
    //             color={AppColors.secondaryVariant}
    //             onPress={() => {
    //               onDeleteButtonPress();
    //             }}
    //           >
    //             Confirm
    //           </Button>
    //         </Dialog.Actions>
    //       </Dialog>
    //     </Portal>
    //   </View>
    // </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default AppDelInvoice;
