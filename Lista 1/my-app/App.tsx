import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from 'react';
import Um from './src/pages/Um';
import Dois from './src/pages/Dois';
import Tres from './src/pages/Tres';
import Quatro from './src/pages/Quatro/index';
import Cinco from './src/pages/Cinco/index';  
import Seis from './src/pages/Seis/index';
import Sete from './src/pages/Sete/index';
import Oito from './src/pages/Oito/index';
import Nove from './src/pages/Nove';
import Dez from './src/pages/Dez';
import Home from './src/pages/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Um" component={Um} />
        <Stack.Screen name="Dois" component={Dois} />
        <Stack.Screen name="Tres" component={Tres} />
        <Stack.Screen name="Quatro" component={Quatro} />
        <Stack.Screen name="Cinco" component={Cinco} />
        <Stack.Screen name="Seis" component={Seis} />
        <Stack.Screen name="Sete" component={Sete} />
        <Stack.Screen name="Oito" component={Oito} />
        <Stack.Screen name="Nove" component={Nove} />
        <Stack.Screen name="Dez" component={Dez} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}





