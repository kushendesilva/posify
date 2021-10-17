import React from "react";
import { View, FlatList, StyleSheet, BackHandler } from "react-native";
import ExtendedButton from "../components/ExtendedButton";
import Screen from "../components/Screen";
import { Provider, Portal, Dialog, ToggleButton } from "react-native-paper";
import {
  Icon,
  Card,
  Text,
  useTheme,
  Button,
  Calendar,
} from "@ui-kitten/components";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";

function AppSupplies({ navigation, route }) {
  const { user } = route.params;

  const theme = useTheme();

  const CheckIcon = (props) => (
    <Icon {...props} name="checkmark-circle-outline" />
  );
  const NewIcon = (props) => <Icon {...props} name="plus-outline" />;
  const CancelIcon = (props) => <Icon {...props} name="slash-outline" />;

  const [reqVisible, setReqVisible] = React.useState(false);

  const showReqDialog = () => setReqVisible(true);

  const hideReqDialog = () => setReqVisible(false);

  const requestRef = firebase.firestore().collection("supplies");

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

  const [date, setDate] = React.useState(new Date());

  return (
    <Provider>
      <Screen>
        <View style={styles.screen}>
          <FlatList
            data={requests.sort((a, b) =>
              a.requestID.localeCompare(b.requestID)
            )}
            keyExtractor={(request) => request.id}
            renderItem={({ item }) => (
              <>
                {AppRenderIf(
                  null != item.supplier &&
                    item.delivered != true &&
                    item.unavailable != true,
                  <Card
                    status="primary"
                    style={{ margin: "2%" }}
                    onPress={(values) => {
                      navigation.navigate("AppSupply", {
                        request: {
                          docID: item.requestID,
                          requiredDate: item.requiredDate,
                          supplier: item.supplier,
                          received: item.received,
                          delivered: item.delivered,
                          unavailable: item.unavailable,
                          type: user.type,
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
                          name="archive-outline"
                        />
                        <Text
                          style={{ fontSize: 12, textTransform: "capitalize" }}
                        >
                          {item.requiredDate}
                        </Text>
                      </View>

                      <View style={{ flexDirection: "column" }}>
                        <Text style={styles.title}>{item.supplier}</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text category="label">{item.requestID}</Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                )}
                {AppRenderIf(
                  null != item.supplier &&
                    item.delivered == true &&
                    item.received != true,
                  <Card
                    status="success"
                    style={{ margin: "2%" }}
                    onPress={(values) => {
                      navigation.navigate("AppSupply", {
                        request: {
                          docID: item.requestID,
                          requiredDate: item.requiredDate,
                          supplier: item.supplier,
                          received: item.received,
                          delivered: item.delivered,
                          unavailable: item.unavailable,
                          type: user.type,
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
                          name="archive-outline"
                        />
                        <Text
                          style={{ fontSize: 12, textTransform: "capitalize" }}
                        >
                          {item.requiredDate}
                        </Text>
                      </View>

                      <View style={{ flexDirection: "column" }}>
                        <Text style={styles.title}>{item.supplier}</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text category="label">{item.requestID}</Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                )}
                {AppRenderIf(
                  null != item.supplier && item.received == true,
                  <Card
                    status="basic"
                    style={{ margin: "2%" }}
                    onPress={(values) => {
                      navigation.navigate("AppSupply", {
                        request: {
                          docID: item.requestID,
                          requiredDate: item.requiredDate,
                          supplier: item.supplier,
                          received: item.received,
                          delivered: item.delivered,
                          unavailable: item.unavailable,
                          type: user.type,
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
                          name="archive-outline"
                        />
                        <Text
                          style={{ fontSize: 12, textTransform: "capitalize" }}
                        >
                          {item.requiredDate}
                        </Text>
                      </View>

                      <View style={{ flexDirection: "column" }}>
                        <Text style={styles.title}>{item.supplier}</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text category="label">{item.requestID}</Text>
                        </View>
                      </View>
                    </View>
                  </Card>
                )}
                {AppRenderIf(
                  null != item.supplier && item.unavailable == true,
                  <Card
                    status="danger"
                    style={{ margin: "2%" }}
                    onPress={(values) => {
                      navigation.navigate("AppSupply", {
                        request: {
                          docID: item.requestID,
                          requiredDate: item.requiredDate,
                          supplier: item.supplier,
                          received: item.received,
                          delivered: item.delivered,
                          unavailable: item.unavailable,
                          type: user.type,
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
                          name="archive-outline"
                        />
                        <Text
                          style={{ fontSize: 12, textTransform: "capitalize" }}
                        >
                          {item.requiredDate}
                        </Text>
                      </View>

                      <View style={{ flexDirection: "column" }}>
                        <Text style={styles.title}>{item.supplier}</Text>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text category="label">{item.requestID}</Text>
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
                    Choose the Required Date
                  </Text>
                  <React.Fragment>
                    <Calendar
                      date={date}
                      onSelect={(nextDate) => setDate(nextDate)}
                    />
                    <Text
                      category="label"
                      style={{ margin: "2%", fontWeight: "bold" }}
                    >
                      Selected date: {date.toLocaleDateString()}
                    </Text>
                  </React.Fragment>
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
                    navigation.navigate("SelectSupplierScreen", {
                      date: date.toLocaleDateString(),
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
        {AppRenderIf(
          user.type == "admin" || user.type == "employee",
          <Button
            size="large"
            style={styles.fab}
            status="primary"
            accessoryLeft={NewIcon}
            onPress={showReqDialog}
          />
        )}
      </Screen>
    </Provider>
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    borderRadius: 25,
  },
});

export default AppSupplies;
