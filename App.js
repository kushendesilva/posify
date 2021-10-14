import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

import { ThemeContext } from "./src/configs/theme";
import AppColors from "./src/configs/AppColors";

import AppLogin from "./src/screens/AppLogin";
import AppSignUp from "./src/screens/AppSignUp";
import AppHome from "./src/screens/AppHome";
import AppHelp from "./src/screens/AppHelp";
import AppShop from "./src/screens/AppShop";
import AppStock from "./src/screens/AppStock";
import AppEmployee from "./src/screens/AppEmployee";
import AppSuppliers from "./src/screens/AppSuppliers";
import AppProfile from "./src/screens/AppProfile";
import AppReport from "./src/screens/AppReport";
import AppBanners from "./src/screens/AppBanners";
import AppBanner from "./src/screens/AppBanner";
import AppReportExport from "./src/screens/AppReportExport";
import AppSelectShop from "./src/screens/AppSelectShop";
import AppAddInvoice from "./src/screens/AppAddInvoice";
import AppAddRequests from "./src/screens/AppAddRequests";
import AppAddBanner from "./src/screens/AppAddBanner";
import AppRequests from "./src/screens/AppRequests";
import AppRequest from "./src/screens/AppRequest";
import AppAddReturn from "./src/screens/AppAddReturn";
import AppAddShop from "./src/screens/AppAddShop";
import AppAddEmployee from "./src/screens/AppAddEmployee";
import AppAddSuppliers from "./src/screens/AppAddSuppliers";
import AppAddStock from "./src/screens/AppAddStock";
import AppEditStock from "./src/screens/AppEditStock";
import AppInvoices from "./src/screens/AppInvoices";
import AppInvoice from "./src/screens/AppInvoice";
import AppDelInvoice from "./src/screens/AppDelInvoice";

import { firebase } from "./src/configs/Database";

const MainStack = createStackNavigator();

export default () => {
  const [theme, setTheme] = React.useState("light");

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
  };

  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
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
                    name="AppHelp"
                    component={AppHelp}
                    options={{
                      title: "Help",
                    }}
                  />
                  <MainStack.Screen
                    name="InvoicesScreen"
                    component={AppInvoices}
                    options={{
                      title: "Invoices",
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
                    name="ProfileScreen"
                    component={AppProfile}
                    options={{
                      title: "Profile",
                    }}
                  />
                  <MainStack.Screen
                    name="AddRequestsScreen"
                    component={AppAddRequests}
                    options={{
                      title: "New Request",
                      headerShown: false,
                    }}
                  />
                  <MainStack.Screen
                    name="RequestsScreen"
                    component={AppRequests}
                    options={{
                      title: "Requests",
                    }}
                  />
                  <MainStack.Screen
                    name="AppRequest"
                    component={AppRequest}
                    options={{
                      title: "Request",
                      headerShown: false,
                    }}
                  />
                  <MainStack.Screen
                    name="SelectShopScreen"
                    component={AppSelectShop}
                    options={{
                      title: "Select Shop",
                    }}
                  />
                  <MainStack.Screen
                    name="AddInvoiceScreen"
                    component={AppAddInvoice}
                    options={{
                      title: "New Invoice",
                      headerShown: false,
                    }}
                  />
                  <MainStack.Screen
                    name="AddReturnScreen"
                    component={AppAddReturn}
                    options={{
                      title: "Deduct Returns",
                      headerShown: false,
                    }}
                  />
                  <MainStack.Screen
                    name="StockScreen"
                    component={AppStock}
                    options={{
                      title: "Stock",
                    }}
                  />
                  <MainStack.Screen
                    name="AddStockScreen"
                    component={AppAddStock}
                    options={{
                      title: "New Items",
                    }}
                  />
                  <MainStack.Screen
                    name="EditStockScreen"
                    component={AppEditStock}
                    options={{
                      title: "Edit Items",
                      headerShown: false,
                    }}
                  />
                  <MainStack.Screen
                    name="ShopScreen"
                    component={AppShop}
                    options={{
                      title: "Shops",
                    }}
                  />
                  <MainStack.Screen
                    name="AddShopScreen"
                    component={AppAddShop}
                    options={{
                      title: "New Shop",
                    }}
                  />
                  <MainStack.Screen
                    name="AppBanners"
                    component={AppBanners}
                    options={{
                      title: "Banners",
                    }}
                  />
                  <MainStack.Screen
                    name="AppBanner"
                    component={AppBanner}
                    options={{
                      title: "Banner",
                      headerShown: false,
                    }}
                  />
                  <MainStack.Screen
                    name="AppAddBanner"
                    component={AppAddBanner}
                    options={{
                      title: "New Banner",
                    }}
                  />
                  <MainStack.Screen
                    name="ReportScreen"
                    component={AppReport}
                    options={{
                      title: "Reports",
                    }}
                  />
                  <MainStack.Screen
                    name="ReportExport"
                    component={AppReportExport}
                    options={{
                      title: "Report",
                    }}
                  />
                  <MainStack.Screen
                    name="EmployeeScreen"
                    component={AppEmployee}
                    options={{
                      title: "Employees",
                    }}
                  />
                  <MainStack.Screen
                    name="AddEmployeeScreen"
                    component={AppAddEmployee}
                    options={{
                      title: "New Employees",
                    }}
                  />
                  <MainStack.Screen
                    name="SuppliersScreen"
                    component={AppSuppliers}
                    options={{
                      title: "Suppliers",
                    }}
                  />
                  <MainStack.Screen
                    name="AddSuppliersScreen"
                    component={AppAddSuppliers}
                    options={{
                      title: "New Supplier",
                    }}
                  />
                </>
              ) : (
                <>
                  <MainStack.Screen
                    name="LoginScreen"
                    component={AppLogin}
                    options={{
                      title: "Login",
                      headerShown: false,
                    }}
                  />
                  <MainStack.Screen
                    name="SignUpScreen"
                    component={AppSignUp}
                    options={{
                      title: "SignUp",
                      headerShown: false,
                    }}
                  />
                </>
              )}
            </MainStack.Navigator>
          </NavigationContainer>
        </ApplicationProvider>
      </ThemeContext.Provider>
    </>
  );
};
