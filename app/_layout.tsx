import { Stack, Tabs } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "App-Name": require("../assets/fonts/wonderella.otf"),
    Lato: require("../assets/fonts/Lato-Regular.ttf"),
    Title: require("../assets/fonts/PoiretOne-Regular.ttf"),
    "Title-light": require("../assets/fonts/LexendGiga-Light.ttf"),
    "Tittle-bold": require("../assets/fonts/LexendGiga-Regular.ttf"),
    Space: require("../assets/fonts/SpaceMono-Regular.ttf"),
    SUB: require("../assets/fonts/DMSans_24pt-Regular.ttf"),
    SUBOLD: require("../assets/fonts/DMSans_24pt-SemiBold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  // const [loaded] = useFonts({
  //   // You can add custom fonts here if needed
  // });

  return (
    <ThemeProvider>
      <RootLayoutNav />
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const { theme, isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.background,
            borderTopColor: theme.border,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: "500",
          },
          headerShown: false,
        }}
      >
       <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        />
    
      


            <Tabs.Screen
          name="HistoryScreen"
          options={{
            title: "HistoryScreen",
            tabBarIcon: ({ color, size }) => (
              // <FontAwesome name="history"  />
              <Ionicons name="time" size={size} color={color} />
            ),
          }}
        />
      

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
       
      </Tabs>
    </>
  );
}
