import { Colors } from "@/constants/theme";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.brand.deepBlue,
        tabBarInactiveTintColor: Colors.neutral.hint,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) => (
            <Feather name="clock" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarButton: (props) => <ScanTabButton {...props} />,
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: "Cards",
          tabBarIcon: ({ color }) => (
            <Feather name="credit-card" size={22} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

type ScanTabButtonProps = {
  onPress?: (event: GestureResponderEvent) => void;
  accessibilityState?: { selected?: boolean };
};

function ScanTabButton({ onPress }: ScanTabButtonProps) {
  return (
    <View style={scanStyles.wrapper}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          scanStyles.button,
          pressed && scanStyles.buttonPressed,
        ]}
        android_ripple={{ color: "rgba(255,255,255,0.25)", borderless: true }}
      >
        <Ionicons name="scan-outline" size={26} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 78,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderTopColor: Colors.neutral.divider,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
});

const scanStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.brand.blue,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.brand.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    marginTop: -4,
  },
  buttonPressed: {
    backgroundColor: Colors.brand.bluePressed,
  },
});
