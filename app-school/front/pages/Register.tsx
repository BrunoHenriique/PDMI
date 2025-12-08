import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import authService from '../service/authService';

interface RegisterProps {
  onNavigateToLogin: () => void;
}

export default function Register({ onNavigateToLogin }: RegisterProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmSenha: '',
    tipo: 'ALUNO' as 'ALUNO' | 'PROFESSOR',
    matricula: '',
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { nome, email, senha, confirmSenha, tipo, matricula } = formData;

    if (!nome || !email || !senha || !confirmSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (tipo === 'ALUNO' && !matricula) {
      Alert.alert('Erro', 'Matrícula é obrigatória para alunos');
      return;
    }

    if (senha !== confirmSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await authService.register({
        nome,
        email,
        senha,
        tipo,
        matricula: tipo === 'ALUNO' ? matricula : undefined,
      });

      Alert.alert(
        'Sucesso',
        'Usuário cadastrado com sucesso! Faça login para continuar.',
        [{ text: 'OK', onPress: onNavigateToLogin }]
      );
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao cadastrar usuário';
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Limpar matrícula se mudou para professor
      ...(field === 'tipo' && value === 'PROFESSOR' ? { matricula: '' } : {}),
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Cadastro</Text>
            <Text style={styles.subtitle}>Crie sua conta</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nome completo"
                value={formData.nome}
                onChangeText={(value) => updateFormData('nome', value)}
                placeholderTextColor="#666"
              />

              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#666"
              />

              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Tipo de usuário:</Text>
                <Picker
                  selectedValue={formData.tipo}
                  style={styles.picker}
                  onValueChange={(value: string) => updateFormData('tipo', value)}
                >
                  <Picker.Item label="Aluno" value="ALUNO" />
                  <Picker.Item label="Professor" value="PROFESSOR" />
                </Picker>
              </View>

              {formData.tipo === 'ALUNO' && (
                <TextInput
                  style={styles.input}
                  placeholder="Matrícula"
                  value={formData.matricula}
                  onChangeText={(value) => updateFormData('matricula', value)}
                  placeholderTextColor="#666"
                />
              )}

              <TextInput
                style={styles.input}
                placeholder="Senha"
                value={formData.senha}
                onChangeText={(value) => updateFormData('senha', value)}
                secureTextEntry
                placeholderTextColor="#666"
              />

              <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                value={formData.confirmSenha}
                onChangeText={(value) => updateFormData('confirmSenha', value)}
                secureTextEntry
                placeholderTextColor="#666"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.linkButton}
              onPress={onNavigateToLogin}
            >
              <Text style={styles.linkText}>
                Já tem conta? Faça login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  pickerLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  picker: {
    height: 50,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linkButton: {
    alignItems: 'center',
  },
  linkText: {
    color: '#007AFF',
    fontSize: 16,
  },
});