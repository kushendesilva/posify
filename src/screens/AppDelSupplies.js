import React from "react";
import { View, StyleSheet } from "react-native";
import { Button, Card, Modal, Text, Icon } from "@ui-kitten/components";
import Screen from "../components/Screen";
import { firebase } from "../configs/Database";

function AppDelSupplies({ route, navigation }) {
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
          onPress={showConfirmation}
        >
          Delete
        </Button>
      </Card>

      <Modal
        visible={visible}
        backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
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
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 192,
  },
});

export default AppDelSupplies;
