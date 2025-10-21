import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './lista4/myapp/screens/LoginScreen';
import HomeScreen from './lista4/myapp/screens/HomeScreen';
import BoletimScreen from './lista4/myapp/screens/BoletimScreen';
import CadastroAlunoScreen from './lista4/myapp/screens/CadastroAlunoScreen';
import CadastroProfessorScreen from './lista4/myapp/screens/CadastroProfessorScreen';
import CadastroDisciplinaScreen from './lista4/myapp/screens/CadastroDisciplinaScreen';

const Stack = createStackNavigator();


const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6C5CE7',
    background: '#F5F6FA',
    card: '#FFFFFF',
    text: '#2D3436',
    border: '#DDD6FE',
  },
};

export default function App() {
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Home'>('Login');
  const [perfil, setPerfil] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verificarLogin = async () => {
      try {
        const token = await AsyncStorage.getItem('@token');
        const perfilSalvo = await AsyncStorage.getItem('@perfil');
        if (token && perfilSalvo) {
          setInitialRoute('Home');
          setPerfil(perfilSalvo);
        } else {
          setInitialRoute('Login');
        }
      } catch (err) {
        console.error(err);
        setInitialRoute('Login');
      } finally {
        setLoading(false);
      }
    };

    verificarLogin();
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer theme={MyTheme}>
      <StatusBar backgroundColor="#6C5CE7" barStyle="light-content" />
      <Stack.Navigator 
        initialRouteName={initialRoute}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#6C5CE7',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          cardStyle: {
            backgroundColor: '#F5F6FA'
          }
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ 
            title: 'EduMax Pro',
            headerBackTitle: 'Sair'
          }}
          initialParams={{ perfil }}
        />
        <Stack.Screen 
          name="Boletim" 
          component={BoletimScreen} 
          options={{ title: '📊 Relatório Acadêmico' }}
        />
        <Stack.Screen 
          name="CadastroAluno" 
          component={CadastroAlunoScreen} 
          options={{ title: '👨‍🎓 Novo Estudante' }}
        />
        <Stack.Screen 
          name="CadastroProfessor" 
          component={CadastroProfessorScreen} 
          options={{ title: '👨‍🏫 Novo Educador' }}
        />
        <Stack.Screen 
          name="CadastroDisciplina" 
          component={CadastroDisciplinaScreen} 
          options={{ title: '📚 Nova Matéria' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}