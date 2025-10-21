import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation, route }: any) {
  const perfil = route.params?.perfil || 'aluno';

  const getPerfilName = () => {
    switch(perfil) {
      case 'admin': return '👨‍💼 Administrador';
      case 'professor': return '👨‍🏫 Professor';
      default: return '👨‍🎓 Estudante';
    }
  };

  const getPerfilColor = () => {
    switch(perfil) {
      case 'admin': return '#E17055';
      case 'professor': return '#00B894';
      default: return '#6C5CE7';
    }
  };

  const handleLogout = async () => {
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('@token');
          await AsyncStorage.removeItem('@perfil');

          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          );
        },
      },
    ]);
  };

  const MenuButton = ({ title, onPress, icon, color = '#2E86AB' }: any) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#FFFFFF" />
      </View>
      <Text style={styles.menuText}>{title}</Text>
      <Ionicons name="chevron-forward" size={20} color="#6C757D" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={[styles.avatar, { backgroundColor: getPerfilColor() }]}>
          <Ionicons name="sparkles" size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.welcome}>Bem-vindo ao EduMax Pro</Text>
        <View style={[styles.perfilBadge, { backgroundColor: getPerfilColor() }]}>
          <Text style={styles.perfilText}>{getPerfilName()}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>🚀 Painel de Controle</Text>
        
        <MenuButton 
          title="📊 Relatório Acadêmico" 
          icon="bar-chart" 
          color="#6C5CE7"
          onPress={() => navigation.navigate('Boletim')} 
        />

        {(perfil === 'admin' || perfil === 'professor') && (
          <MenuButton 
            title="📚 Nova Matéria" 
            icon="library" 
            color="#00B894"
            onPress={() => navigation.navigate('CadastroDisciplina')} 
          />
        )}

        {perfil === 'admin' && (
          <>
            <MenuButton 
              title="👨‍🎓 Novo Estudante" 
              icon="person-add" 
              color="#FDCB6E"
              onPress={() => navigation.navigate('CadastroAluno')} 
            />
            <MenuButton 
              title="👨‍🏫 Novo Educador" 
              icon="school" 
              color="#E17055"
              onPress={() => navigation.navigate('CadastroProfessor')} 
            />
          </>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#E74C3C" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  welcome: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 12,
    textAlign: 'center',
  },
  perfilBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  perfilText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    margin: 20,
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E74C3C',
    shadowColor: '#E74C3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutText: {
    color: '#E74C3C',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});