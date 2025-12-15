import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import professorService from '../service/professorService';

interface UpdateProfileProfessorProps {
  navigation: any;
}

const UpdateProfileProfessor: React.FC<UpdateProfileProfessorProps> = ({ navigation }) => {
  const [userData, setUserData] = useState({
    usuarioId: 0,
    nome: '',
    email: '',
    senha: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userType = await AsyncStorage.getItem('userType');
      
      if (userId && userType === 'PROFESSOR') {
        setUserData(prev => ({
          ...prev,
          usuarioId: parseInt(userId)
        }));
      } else {
        Alert.alert('Erro', 'Usuário não encontrado. Faça login novamente.');
      }
    } catch (error) {
      console.error('Erro ao carregar ID do usuário:', error);
      Alert.alert('Erro', 'Erro ao carregar dados. Faça login novamente.');
    }
  };

  const validateForm = () => {
    if (!userData.usuarioId) {
      Alert.alert('Erro', 'ID do usuário não encontrado');
      return false;
    }

    if (!userData.nome || userData.nome.trim().length < 2) {
      Alert.alert('Erro', 'Nome é obrigatório e deve ter pelo menos 2 caracteres');
      return false;
    }

    if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      Alert.alert('Erro', 'Email é obrigatório e deve ser válido');
      return false;
    }

    if (userData.senha && userData.senha.length < 6) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (userData.senha && userData.senha !== userData.confirmPassword) {
      Alert.alert('Erro', 'Senhas não conferem');
      return false;
    }

    return true;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updateData: any = {
        usuarioId: userData.usuarioId,
        nome: userData.nome,
        email: userData.email
      };

      // Só inclui senha se foi preenchida
      if (userData.senha) {
        updateData.senha = userData.senha;
      }

      const response = await professorService.update(updateData);
      
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao atualizar perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Atualizar Perfil</Text>
      
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite seu nome completo"
          value={userData.nome}
          onChangeText={(text) => setUserData({ ...userData, nome: text })}
          editable={!loading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          value={userData.email}
          onChangeText={(text) => setUserData({ ...userData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Nova senha (deixe vazio para não alterar)"
          value={userData.senha}
          onChangeText={(text) => setUserData({ ...userData, senha: text })}
          secureTextEntry
          editable={!loading}
        />
        
        {userData.senha.length > 0 && (
          <TextInput
            style={styles.input}
            placeholder="Confirmar nova senha"
            value={userData.confirmPassword}
            onChangeText={(text) => setUserData({ ...userData, confirmPassword: text })}
            secureTextEntry
            editable={!loading}
          />
        )}
        
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Atualizando...' : 'Atualizar Perfil'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateProfileProfessor;