import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
//import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { CepProvider } from "./src/contexts/cepContext";

import React from "react";
import Um from "./src/pages/Um";
import Dois from "./src/pages/Dois";
import Tres from "./src/pages/Tres";
import Quatro from "./src/pages/Quatro/index";
import Cinco from "./src/pages/Cinco/index";
import Seis from "./src/pages/Seis/index";
import Sete from "./src/pages/Sete/index";
import Oito from "./src/pages/Oito/index";
import Nove from "./src/pages/Nove";
import Dez from "./src/pages/Dez";
import viaCep from "./src/pages/Cep/viaCepPages";
import consultaCep from "./src/pages/Cep/consultaCep"

//const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <CepProvider>
        <Drawer.Navigator initialRouteName="Um">
          <Drawer.Screen
            name="Um"
            component={Um}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="print" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Dois"
            component={Dois}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="map" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Tres"
            component={Tres}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="medal" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Quatro"
            component={Quatro}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="radio" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Cinco"
            component={Cinco}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="wifi" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Seis"
            component={Seis}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="school" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Sete"
            component={Sete}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="apps" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Oito"
            component={Oito}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="settings" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Nove"
            component={Nove}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="thunderstorm" size={size} color={color} />
              ),
            }}
          />
          <Drawer.Screen
            name="Dez"
            component={Dez}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="today" size={size} color={color} />
              ),
            }}
          />

          <Drawer.Screen
            name="viaCep"
            component={viaCep}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="pin" size={size} color={color} />
              ),
            }}
          />

          <Drawer.Screen
            name="Consultas de CEP"
            component={consultaCep}
            options={{
              drawerIcon: ({ color, size }) => (
                <Ionicons name="list" size={size} color={color} />
              ),
            }}
          />
        </Drawer.Navigator>
      </CepProvider>
    </NavigationContainer>
  );
}
