import React from "react";
import { ScrollView } from "react-native";
import { Icon, Button, Input } from "@ui-kitten/components";
import { Dialog, Portal, Paragraph, Provider } from "react-native-paper";
import { firebase } from "../configs/Database";
import Screen from "../components/Screen";

function AppAddBanner(props) {
  const { bannerID } = props.route.params;

  const DoneIcon = (props) => (
    <Icon {...props} name="checkmark-circle-2-outline" />
  );

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const bannerRef = firebase.firestore().collection("banners");

  const onAddButtonPress = () => {
    if (title && title.length > 0) {
      const data = {
        title,
        content,
      };
      bannerRef
        .doc(bannerID)
        .update(data)
        .then((_doc) => {
          setTitle("");
          props.navigation.goBack();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  return (
    <Provider>
      <Screen>
        <ScrollView style={{ marginTop: "3%" }}>
          <Input
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="primary"
            value={title}
            label="Title"
            placeholder="Enter Banner Title"
            onChangeText={(text) => setTitle(text)}
          />
          <Input
            style={{ marginHorizontal: "2%", marginVertical: "1%" }}
            size="large"
            status="primary"
            value={content}
            label="Content"
            placeholder="Enter Banner Content"
            onChangeText={(text) => setContent(text)}
            multiline={true}
            textStyle={{ minHeight: 64 }}
          />

          <Button
            size="giant"
            status="primary"
            style={{ margin: "2%" }}
            onPress={showDialog}
            accessoryRight={DoneIcon}
          >
            Submit
          </Button>
        </ScrollView>

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Notice</Dialog.Title>
            <Dialog.Content>
              <Paragraph>Confirmation</Paragraph>
            </Dialog.Content>
            <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
              <Button status="danger" onPress={hideDialog}>
                Cancel
              </Button>
              <Button
                status="success"
                onPress={() => {
                  hideDialog();
                  onAddButtonPress();
                }}
              >
                Confirm
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </Screen>
    </Provider>
  );
}

export default AppAddBanner;
