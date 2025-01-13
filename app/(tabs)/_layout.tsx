import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Loja",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="store-settings-outline" size={28} color="white" />
          ),
        }}
      />
      <Tabs.Screen
        name="Produtos"
        options={{
          title: "produtos",
          tabBarIcon: ({ color }) => (
            <AntDesign name="laptop" size={28} color="white" />)
        }}
      />
      <Tabs.Screen
        name="vendas"
        options={{
          title: "Vendas",
          tabBarIcon: ({ color }) => (
            <AntDesign name="shoppingcart" size={28} color="white" />
          ),
        }}
      />
      
    </Tabs>
  );
}
