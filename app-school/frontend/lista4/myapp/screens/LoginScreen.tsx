import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.login(email, senha);
      const token = res.data.token;
      await AsyncStorage.setItem('@token', token);
      
      const perfil = res.data.perfil || 'aluno';
      await AsyncStorage.setItem('@perfil', perfil);
      
      navigation.replace('Home', { perfil });
    } catch (err: any) {
      console.error(err?.response || err);
      Alert.alert('Erro', err?.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Ionicons name="rocket" size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>EduMax Pro</Text>
        <Text style={styles.subtitle}>Plataforma Educacional do Futuro</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail" size={20} color="#6C757D" style={styles.inputIcon} />
          <TextInput 
            placeholder="Email" 
            style={styles.input} 
            value={email} 
            onChangeText={setEmail} 
            autoCapitalize="none"
            keyboardType="email-address"
            placeholderTextColor="#6C757D"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed" size={20} color="#6C757D" style={styles.inputIcon} />
          <TextInput 
            placeholder="Senha" 
            style={styles.input} 
            value={senha} 
            onChangeText={setSenha} 
            secureTextEntry={secureText}
            placeholderTextColor="#6C757D"
          />
          <TouchableOpacity 
            onPress={() => setSecureText(!secureText)}
            style={styles.eyeIcon}
          >
            <Ionicons 
              name={secureText ? "eye-off" : "eye"} 
              size={20} 
              color="#6C757D" 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[
            styles.loginButton, 
            loading && styles.loginButtonDisabled
          ]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.loginButtonText}>Entrando...</Text>
          ) : (
            <>
              <Text style={styles.loginButtonText}>Entrar</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.demoContainer}>
          <Text style={styles.demoTitle}>🚀 Acesso de Demonstração</Text>
          <Text style={styles.demoText}>👨‍💼 Administrador: admin@app.com / 1234</Text>
          <Text style={styles.demoText}>👨‍🏫 Professor: prof@app.com / 1234</Text>
          <Text style={styles.demoText}>👨‍🎓 Estudante: aluno@app.com / 1234</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#6C5CE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#636E72',
    textAlign: 'center',
    fontWeight: '500',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#DDD6FE',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#B2BEC3',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  demoContainer: {
    marginTop: 40,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#DDD6FE',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6C5CE7',
    marginBottom: 12,
    textAlign: 'center',
  },
  demoText: {
    fontSize: 14,
    color: '#2D3436',
    marginBottom: 8,
    fontWeight: '500',
  },
});