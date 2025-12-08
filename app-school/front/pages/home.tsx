import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface HomeProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export default function Home({ onNavigateToLogin, onNavigateToRegister }: HomeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sistema Escolar</Text>
      <Text style={styles.subtitle}>Bem-vindo ao portal educacional</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onNavigateToLogin}>
          <Text style={styles.buttonText}>Fazer Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={onNavigateToRegister}
        >
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>
            Cadastrar-se
          </Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.description}>
        Acesse suas notas, disciplinas e muito mais!
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 50,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#007AFF',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});