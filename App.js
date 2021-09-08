import React, { useEffect, useState } from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry, Icon } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import { ThemeContext } from "./src/configs/theme";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Button } from "react-native-paper";

import { firebase } from "./src/configs/Database";
import AppColors from "./src/configs/AppColors";

import AppLogin from "./src/screens/AppLogin";
import AppHome from "./src/screens/AppHome";
import AppShop from "./src/screens/AppShop";
import AppStock from "./src/screens/AppStock";
import AppEmployee from "./src/screens/AppEmployee";
import AppProfile from "./src/screens/AppProfile";
import AppReport from "./src/screens/AppReport";
import AppReportExport from "./src/screens/AppReportExport";

import AppSelectShop from "./src/screens/AppSelectShop";
import AppAddInvoice from "./src/screens/AppAddInvoice";
import AppAddReturn from "./src/screens/AppAddReturn";
import AppAddShop from "./src/screens/AppAddShop";
import AppAddEmployee from "./src/screens/AppAddEmployee";
import AppAddStock from "./src/screens/AppAddStock";

import AppEditShop from "./src/screens/AppEditShop";
import AppEditStock from "./src/screens/AppEditStock";
import AppInvoice from "./src/screens/AppInvoice";
import AppDelInvoice from "./src/screens/AppDelInvoice";

const MainStack = createStackNavigator();
const InvoiceStack = createStackNavigator();
const ShopStack = createStackNavigator();
const StockStack = createStackNavigator();
const ReportStack = createStackNavigator();
const EmployeeStack = createStackNavigator();

export default () => {
  const [theme, setTheme] = React.useState("light");

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const usersRef = firebase.firestore().collection("users");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data();
            setLoading(false);
            setUser(userData);
          })
          .catch((error) => {
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <></>;
  }
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <ApplicationProvider {...eva} theme={eva[theme]}>
          <NavigationContainer>
            <MainStack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: AppColors.primary },
                headerTintColor: AppColors.background,
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            >
              {user ? (
                <>
                  <MainStack.Screen
                    name="AppHome"
                    component={AppHome}
                    options={{
                      title: "Home",
                      headerShown: false,
                    }}
                  />
                  <MainStack.Screen
                    name="AppInvoice"
                    component={AppInvoice}
                    options={({ route }) => ({
                      title:
                        route.params.invoice.docID +
                        " (" +
                        route.params.invoice.shopName +
                        ") | Posify",
                      headerShown: false,
                    })}
                  />
                  <MainStack.Screen
                    name="AppDelInvoice"
                    component={AppDelInvoice}
                    options={{
                      title: "Remove Invoices",
                    }}
                  />
                  <MainStack.Screen
                    name="AddInvoiceScreens"
                    component={AddInvoiceScreens}
                    options={{
                      title: "Add Invoice",
                      headerShown: false,
                    }}
                  />
                  <MainStack.Screen
                    name="ProfileScreen"
                    component={AppProfile}
                    options={{
                      title: "Profile",
                    }}
                  />
                </>
              ) : (
                <MainStack.Screen
                  name="LoginScreen"
                  component={AppLogin}
                  options={{
                    title: "Login",
                    headerShown: false,
                  }}
                />
              )}
            </MainStack.Navigator>
          </NavigationContainer>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </>
  );
};

// const DrawerNav = () => (
//   <Drawer.Navigator
//     initialRouteName="HomeScreens"
//     drawerContent={(props) => <AppDrawerContent {...props} />}
//   >
//     <Drawer.Screen name="HomeScreens" component={HomeScreens} />
//     <Drawer.Screen name="StockScreens" component={StockScreens} />
//     <Drawer.Screen name="ShopScreens" component={ShopScreens} />
//     <Drawer.Screen name="ReportScreens" component={ReportScreens} />
//     <Drawer.Screen name="EmployeeScreens" component={EmployeeScreens} />
//     <Drawer.Screen name="ProfileScreens" component={ProfileScreens} />
//   </Drawer.Navigator>
// );

// const HomeScreens = (props) => (
//   <HomeStack.Navigator
//     screenOptions={{
//       headerStyle: { backgroundColor: AppColors.primary },
//       headerTintColor: AppColors.background,
//       headerTitleStyle: {
//         fontWeight: "bold",
//       },
//     }}
//   >
//     <HomeStack.Screen
//       name="AppInvoices"
//       component={AppInvoices}
//       options={{
//         title: "Invoices",
//       }}
//     />
//     <HomeStack.Screen
//       name="AppInvoice"
//       component={AppInvoice}
//       options={({ route }) => ({
//         title:
//           route.params.invoice.docID +
//           " (" +
//           route.params.invoice.shopName +
//           ") | Posify",
//         headerShown: false,
//       })}
//     />
//     <HomeStack.Screen
//       name="AppDelInvoice"
//       component={AppDelInvoice}
//       options={{
//         title: "Remove Invoices",
//       }}
//     />
//     <HomeStack.Screen
//       name="AddInvoiceScreens"
//       component={AddInvoiceScreens}
//       options={{
//         title: "Add Invoice",
//         headerShown: false,
//       }}
//     />
//   </HomeStack.Navigator>
// );

const AddInvoiceScreens = (props) => (
  <InvoiceStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: AppColors.primary },
      headerTintColor: AppColors.background,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <InvoiceStack.Screen
      name="SelectShopScreen"
      component={AppSelectShop}
      options={{
        title: "Select Shop",
      }}
    />
    <InvoiceStack.Screen
      name="AddInvoiceScreen"
      component={AppAddInvoice}
      options={{
        title: "New Invoice",
        headerShown: false,
      }}
    />
    <InvoiceStack.Screen
      name="AddReturnScreen"
      component={AppAddReturn}
      options={{
        title: "Deduct Returns",
        headerShown: false,
      }}
    />
  </InvoiceStack.Navigator>
);

const StockScreens = (props) => (
  <StockStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: AppColors.primary },
      headerTintColor: AppColors.background,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <StockStack.Screen
      name="StockScreen"
      component={AppStock}
      options={{
        title: "Stock",
        headerLeft: () => (
          <Button
            labelStyle={{ fontSize: 24 }}
            icon="menu"
            color={AppColors.background}
            onPress={() => props.navigation.openDrawer()}
          />
        ),
      }}
    />
    <StockStack.Screen
      name="AddStockScreen"
      component={AppAddStock}
      options={{
        title: "New Items",
      }}
    />
    <StockStack.Screen
      name="EditStockScreen"
      component={AppEditStock}
      options={{
        title: "Edit Items",
        headerShown: false,
      }}
    />
  </StockStack.Navigator>
);

const ShopScreens = (props) => (
  <ShopStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: AppColors.primary },
      headerTintColor: AppColors.background,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <ShopStack.Screen
      name="ShopScreen"
      component={AppShop}
      options={{
        title: "Shops",
        headerLeft: () => (
          <Button
            labelStyle={{ fontSize: 24 }}
            icon="menu"
            color={AppColors.background}
            onPress={() => props.navigation.openDrawer()}
          />
        ),
      }}
    />
    <ShopStack.Screen
      name="AddShopScreen"
      component={AppAddShop}
      options={{
        title: "New Shop",
      }}
    />
    <ShopStack.Screen
      name="EditShopScreen"
      component={AppEditShop}
      options={{
        title: "Edit Shop Details",
        headerShown: false,
      }}
    />
  </ShopStack.Navigator>
);

const ReportScreens = (props) => (
  <ReportStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: AppColors.primary },
      headerTintColor: AppColors.background,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <ReportStack.Screen
      name="ReportScreen"
      component={AppReport}
      options={{
        title: "Reports",
        headerLeft: () => (
          <Button
            labelStyle={{ fontSize: 24 }}
            icon="menu"
            color={AppColors.background}
            onPress={() => props.navigation.openDrawer()}
          />
        ),
      }}
    />
    <ReportStack.Screen
      name="ReportExport"
      component={AppReportExport}
      options={{
        title: "Report",
      }}
    />
  </ReportStack.Navigator>
);

const EmployeeScreens = (props) => (
  <EmployeeStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: AppColors.primary },
      headerTintColor: AppColors.background,
      headerTitleStyle: {
        fontWeight: "bold",
      },
    }}
  >
    <EmployeeStack.Screen
      name="EmployeeScreen"
      component={AppEmployee}
      options={{
        title: "Employees",
        headerLeft: () => (
          <Button
            labelStyle={{ fontSize: 24 }}
            icon="menu"
            color={AppColors.background}
            onPress={() => props.navigation.openDrawer()}
          />
        ),
      }}
    />
    <EmployeeStack.Screen
      name="AddEmployeeScreen"
      component={AppAddEmployee}
      options={{
        title: "New Employees",
      }}
    />
  </EmployeeStack.Navigator>
);

// const ProfileScreens = (props) => (
//   <ProfileStack.Navigator
//     screenOptions={{
//       headerStyle: { backgroundColor: AppColors.primary },
//       headerTintColor: AppColors.background,
//       headerTitleStyle: {
//         fontWeight: "bold",
//       },
//     }}
//   >
//     <ProfileStack.Screen
//       name="ProfileScreen"
//       component={AppProfile}
//       options={{
//         title: "Settings",
//         headerLeft: () => (
//           <Button
//             labelStyle={{ fontSize: 24 }}
//             icon="menu"
//             color={AppColors.background}
//             onPress={() => props.navigation.openDrawer()}
//           />
//         ),
//       }}
//     />
//   </ProfileStack.Navigator>
// );
