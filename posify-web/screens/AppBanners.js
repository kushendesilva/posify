import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import { Icon, Card, Button, Text, useTheme } from "@ui-kitten/components";
import { Provider, Portal, Dialog, ToggleButton } from "react-native-paper";
import AppRenderIf from "../configs/AppRenderIf";
import { firebase } from "../configs/Database";
import AppColors from "../configs/AppColors";

function AppBanners({ navigation }) {
  const theme = useTheme();

  const CancelIcon = (props) => <Icon {...props} name="slash-outline" />;
  const CheckIcon = (props) => (
    <Icon {...props} name="checkmark-circle-outline" />
  );
  const NewIcon = (props) => <Icon {...props} name="plus-outline" />;

  const [bannerVisible, setBannerVisible] = React.useState(false);

  const showBannerDialog = () => setBannerVisible(true);

  const hideBannerDialog = () => setBannerVisible(false);

  const bannerID = Date.now().toString();

  const [type, setType] = React.useState("alert");

  const [banners, setBanners] = React.useState([]);

  const bannerRef = firebase.firestore().collection("banners");

  const createBanner = () => {
    {
      const data = {
        bannerID,
        type,
      };
      bannerRef
        .doc(bannerID)
        .set(data)
        .then((_doc) => {})
        .catch((error) => {
          alert(error);
        });
    }
  };

  React.useEffect(() => {
    bannerRef.onSnapshot(
      (querySnapshot) => {
        const newBanner = [];
        querySnapshot.forEach((doc) => {
          const banner = doc.data();
          banner.id = doc.id;
          newBanner.push(banner);
        });
        setBanners(newBanner);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <Provider>
      <Screen>
        <View style={styles.screen}>
          <FlatList
            data={banners.sort((a, b) => a.bannerID.localeCompare(b.bannerID))}
            keyExtractor={(banner) => banner.id}
            renderItem={({ item }) => (
              <>
                {AppRenderIf(
                  null != item.title,
                  <Card
                    onPress={(values) =>
                      navigation.navigate("AppBanner", {
                        banner: {
                          bannerID: item.bannerID,
                          title: item.title,
                          content: item.content,
                        },
                      })
                    }
                    style={{
                      margin: "2%",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    status={"primary"}
                  >
                    {AppRenderIf(
                      item.type == "offer",
                      <Icon
                        style={{
                          width: 30,
                          height: 30,
                          marginBottom: "2%",
                          alignSelf: "center",
                        }}
                        fill={AppColors.primary}
                        name="gift-outline"
                      />
                    )}
                    {AppRenderIf(
                      item.type == "alert",
                      <Icon
                        style={{
                          width: 30,
                          height: 30,
                          marginBottom: "2%",
                          alignSelf: "center",
                        }}
                        fill={AppColors.primary}
                        name="alert-triangle-outline"
                      />
                    )}
                    {AppRenderIf(
                      item.type == "notification",
                      <Icon
                        style={{
                          width: 30,
                          height: 30,
                          marginBottom: "2%",
                          alignSelf: "center",
                        }}
                        fill={AppColors.primary}
                        name="bell-outline"
                      />
                    )}
                    <Text style={styles.title}>{item.title}</Text>

                    <Text style={{ textAlign: "center" }} category="label">
                      {item.content}
                    </Text>
                  </Card>
                )}
              </>
            )}
          />
          <Portal>
            <Dialog visible={bannerVisible} onDismiss={hideBannerDialog}>
              <Dialog.Content>
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text
                    style={{ fontWeight: "bold", margin: "5%" }}
                    category="h6"
                  >
                    Choose The Banner Type
                  </Text>
                  <ToggleButton.Row
                    onValueChange={(value) => setType(value)}
                    value={type}
                  >
                    <ToggleButton
                      icon="alert-outline"
                      value="alert"
                    ></ToggleButton>
                    <ToggleButton
                      icon="gift-outline"
                      value="offer"
                    ></ToggleButton>
                    <ToggleButton
                      icon="bell-outline"
                      value="notification"
                    ></ToggleButton>
                  </ToggleButton.Row>
                </View>
              </Dialog.Content>
              <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
                <Button
                  accessoryRight={CancelIcon}
                  onPress={hideBannerDialog}
                  status="danger"
                >
                  Cancel
                </Button>

                <Button
                  accessoryRight={CheckIcon}
                  onPress={() => {
                    hideBannerDialog();
                    createBanner();
                    navigation.navigate("AppAddBanner", {
                      bannerID: bannerID,
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
        <Button
          size="large"
          style={styles.fab}
          status="primary"
          accessoryLeft={NewIcon}
          onPress={showBannerDialog}
        />
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
    textAlign: "center",
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

export default AppBanners;
