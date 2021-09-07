import React from "react";
import ExtendedButton from "../components/ExtendedButton";
import Screen from "../components/Screen";
import { TabBar, Tab, Icon, Text } from "@ui-kitten/components";
import AppRenderIf from "../configs/AppRenderIf";

function AppHome({ navigation, route }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const HomeIcon = (props) => <Icon {...props} name="home-outline" />;
  const NewIcon = (props) => <Icon {...props} name="trending-up-outline" />;
  const AccountIcon = (props) => <Icon {...props} name="person-outline" />;

  return (
    <Screen>
      <TabBar
        style={{ marginVertical: "3%" }}
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
      >
        <Tab icon={NewIcon} />
        <Tab icon={AccountIcon} />
        <Tab icon={HomeIcon} />
      </TabBar>
      {AppRenderIf(
        selectedIndex == 0,
        <>
          <ExtendedButton
            title="Invoices"
            tabIcon={HomeIcon}
            onPress={() => navigation.navigate("AppInvoices")}
          />
          <ExtendedButton title="Requests" tabIcon={HomeIcon} />
          <ExtendedButton title="New Invoices" tabIcon={HomeIcon} />
        </>
      )}

      {AppRenderIf(
        selectedIndex == 1,
        <>
          <ExtendedButton title="Stock" tabIcon={HomeIcon} />
          <ExtendedButton title="Suppliers" tabIcon={HomeIcon} />
          <ExtendedButton title="Stores" tabIcon={HomeIcon} />
          <ExtendedButton title="Employees" tabIcon={HomeIcon} />
        </>
      )}
      {AppRenderIf(
        selectedIndex == 2,
        <>
          <ExtendedButton title="Account Information" tabIcon={HomeIcon} />
          <ExtendedButton title="Reports" tabIcon={HomeIcon} />
          <ExtendedButton title="Log Out" tabIcon={HomeIcon} />
        </>
      )}
    </Screen>
  );
}

export default AppHome;
