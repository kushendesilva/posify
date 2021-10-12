import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import { Icon, Card, Button, Text, useTheme } from "@ui-kitten/components";
import { Provider, Portal, Dialog, Paragraph } from "react-native-paper";
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

  const [visible, setVisible] = React.useState(false);

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const [banners, setBanners] = React.useState([]);

  const bannerRef = firebase.firestore().collection("banners");

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
            <Dialog visible={visible} onDismiss={hideDialog}>
              <Dialog.Title>Confirmation</Dialog.Title>
              <Dialog.Content>
                <Paragraph>Confirm Creating a New Banner</Paragraph>
              </Dialog.Content>
              <Dialog.Actions style={{ justifyContent: "space-evenly" }}>
                <Button
                  accessoryRight={CancelIcon}
                  onPress={hideDialog}
                  status="danger"
                >
                  Cancel
                </Button>

                <Button
                  accessoryRight={CheckIcon}
                  onPress={() => {
                    hideDialog();
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
          onPress={showDialog}
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
