import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importar as páginas
import Home from './pages/home';
import Login from './pages/Login';
import Register from './pages/Register';
import AlunoHome from './pages/AlunoHome';
import ProfessorHome from './pages/ProfessorHome';
import GerenciarNotas from './pages/GerenciarNotas';
import MatricularAluno from './pages/MatricularAluno';
import NotificationsProfessor from './pages/notifications-professor';
import NotificationsStudent from './pages/notifications-student';

type AppState = 
  | 'loading'
  | 'welcome'
  | 'login' 
  | 'register' 
  | 'aluno-dashboard' 
  | 'professor-dashboard'
  | 'gerenciar-notas'
  | 'matricular-alunos'
  | 'notifications-professor'
  | 'notifications-student';

export default function App() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [userType, setUserType] = useState<'ALUNO' | 'PROFESSOR' | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const type = await AsyncStorage.getItem('userType') as 'ALUNO' | 'PROFESSOR' | null;
      
      if (token && type) {
        setUserType(type);
        setAppState(type === 'ALUNO' ? 'aluno-dashboard' : 'professor-dashboard');
      } else {
        setAppState('welcome');
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      setAppState('welcome');
    }
  };

  const handleLogin = (type: 'ALUNO' | 'PROFESSOR') => {
    setUserType(type);
    setAppState(type === 'ALUNO' ? 'aluno-dashboard' : 'professor-dashboard');
  };

  const handleLogout = () => {
    setUserType(null);
    setAppState('welcome');
  };

  const navigateToLogin = () => setAppState('login');
  const navigateToRegister = () => setAppState('register');
  const navigateToWelcome = () => setAppState('welcome');
  const navigateToNotas = () => setAppState('gerenciar-notas');
  const navigateToProfessorDashboard = () => setAppState('professor-dashboard');
  const navigateToMatriculas = () => setAppState('matricular-alunos');
  const navigateToNotificationsProfessor = () => setAppState('notifications-professor');
  const navigateToNotificationsStudent = () => setAppState('notifications-student');
  const navigateToAlunoDashboard = () => setAppState('aluno-dashboard');

  const renderCurrentScreen = () => {
    switch (appState) {
      case 'loading':
        return (
          <View style={styles.loadingContainer}>
            {/* Você pode adicionar um spinner aqui se quiser */}
          </View>
        );

      case 'welcome':
        return (
          <Home 
            onNavigateToLogin={navigateToLogin}
            onNavigateToRegister={navigateToRegister}
          />
        );

      case 'login':
        return (
          <Login 
            onLogin={handleLogin}
            onNavigateToRegister={navigateToRegister}
          />
        );

      case 'register':
        return (
          <Register 
            onNavigateToLogin={navigateToLogin}
          />
        );

      case 'aluno-dashboard':
        return (
          <AlunoHome 
            onLogout={handleLogout}
            onNavigateToNotifications={navigateToNotificationsStudent}
          />
        );

      case 'professor-dashboard':
        return (
          <ProfessorHome 
            onLogout={handleLogout}
            onNavigateToNotas={navigateToNotas}
            onNavigateToMatriculas={navigateToMatriculas}
            onNavigateToNotifications={navigateToNotificationsProfessor}
          />
        );

      case 'gerenciar-notas':
        return (
          <GerenciarNotas 
            onBack={navigateToProfessorDashboard}
          />
        );

      case 'matricular-alunos':
        return (
          <MatricularAluno 
            onBack={navigateToProfessorDashboard}
          />
        );

      case 'notifications-professor':
        return (
          <NotificationsProfessor 
            onBack={navigateToProfessorDashboard}
          />
        );

      case 'notifications-student':
        return (
          <NotificationsStudent 
            onBack={navigateToAlunoDashboard}
          />
        );

      default:
        return (
          <Home 
            onNavigateToLogin={navigateToLogin}
            onNavigateToRegister={navigateToRegister}
          />
        );
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar style="auto" />
        {renderCurrentScreen()}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
