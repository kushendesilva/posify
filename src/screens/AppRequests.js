import React from "react";
import { View, FlatList, StyleSheet, BackHandler } from "react-native";
import ExtendedButton from "../components/ExtendedButton";
import Screen from "../components/Screen";
import { Provider, Portal, Dialog, ToggleButton } from "react-native-paper";
import { Icon, Card, Text, useTheme, Button } from "@ui-kitten/components";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";

function AppRequests({ navigation, route }) {
  const theme = useTheme();
  const { user } = route.params;

  const CancelIcon = (props) => <Icon {...props} name="slash-outline" />;
  const CheckIcon = (props) => (
    <Icon {...props} name="checkmark-circle-outline" />
  );
  const ReqAddIcon = (props) => <Icon {...props} name="folder-add-outline" />;

  const [reqVisible, setReqVisible] = React.useState(false);

  const showReqDialog = () => setReqVisible(true);

  const hideReqDialog = () => setReqVisible(false);

  const requestId = Date.now().toString();
  const getCurrentDate = () => {
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    return date + "/" + month + "/" + year;
  };

  const requestRef = firebase.firestore().collection("requests");

  const createRequest = () => {
    {
      const data = {
        requestID: requestId,
        date: getCurrentDate(),
        shopName: user.name,
        payMethod: value,
      };
      requestRef
        .doc(requestId)
        .set(data)
        .then((_doc) => {})
        .catch((error) => {
          alert(error);
        });
    }
  };

  const [value, setValue] = React.useState("cash");
  const [requests, setRequests] = React.useState([]);

  React.useEffect(() => {
    requestRef.onSnapshot(
      (querySnapshot) => {
        const newRequest = [];
        querySnapshot.forEach((doc) => {
          const request = doc.data();
          request.id = doc.id;
          newRequest.push(request);
        });
        setRequests(newRequest);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <Screen>
      <Provider>
        <View style={styles.screen}>
          <FlatList
            ListHeaderComponent={() => (
              <>
                <ExtendedButton
                  title="New Request"
                  tabIcon={ReqAddIcon}
                  onPress={showReqDialog}
                />
                <Text
                  category="h4"
                  style={{ fontWeight: "bold", textAlign: "center" }}
                >
                  Requests
                </Text>
              </>
            )}
            data={requests}
            keyExtractor={(invoice) => invoice.id}
            renderItem={({ item }) => (
              <>
                {AppRenderIf(
                  null != item.shopName,
                  <Card
                    style={{ margin: "2%" }}
                    onPress={(values) => {
                      navigation.navigate("AppRequest", {
                        request: {
                          docID: item.requestID,
                          payMethod: item.payMethod,
                          shopName: item.shopName,
                          date: item.date,
                        },
                      });
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                      }}
                    >
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          style={{ width: 30, height: 30, margin: "2%" }}
                          fill={theme["color-primary-default"]}
                          name="file-text-outline"
                        />
                        <Text
                          style={{ fontSize: 12, textTransform: "capitalize" }}
                        >
                          {item.payMethod}
                        </Text>
                      </View>

                      <View style={{ flexDirection: "column" }}>
                        <Text style={styles.title}>{item.requestID}</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text category="label">{item.date}</Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                )}
              </>
            )}
          />
          <Portal>
            <Dialog visible={reqVisible} onDismiss={hideReqDialog}>
              <Dialog.Content>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{ fontWeight: "bold", margin: "5%" }}
                    category="h6"
                  >
                    Choose Your Payment Method
                  </Text>
                  <ToggleButton.Row
                    onValueChange={(value) => setValue(value)}
                    value={value}
                  >
                    <ToggleButton icon="cash" value="cash"></ToggleButton>
                    <ToggleButton
                      icon="credit-card"
                      value="card"
                    ></ToggleButton>
                    <ToggleButton
                      icon="card-text-outline"
                      value="cheque"
                    ></ToggleButton>
                  </ToggleButton.Row>
                </View>
              </Dialog.Content>
              <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
                <Button
                  accessoryRight={CancelIcon}
                  onPress={hideReqDialog}
                  status="danger"
                >
                  Cancel
                </Button>

                <Button
                  accessoryRight={CheckIcon}
                  onPress={() => {
                    hideReqDialog();
                    createRequest();
                    navigation.navigate("AddRequestsScreen", {
                      user: user,
                      requestId: requestId,
                    });
                  }}
                  status="success"
                >
                  Confirm
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      </Provider>
    </Screen>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  screen: { flex: 1 },
  row: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  paragraph: {
    fontWeight: "bold",
    marginRight: 3,
  },
});

export default AppRequests;
