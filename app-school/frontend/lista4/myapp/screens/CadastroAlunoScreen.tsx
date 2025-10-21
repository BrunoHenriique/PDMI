import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function CadastroAlunoScreen({ navigation }: any) {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('');

  const handleSalvar = async () => {
    if (!nome.trim() || !matricula.trim() || !curso.trim()) {
      Alert.alert('⚠️ Atenção', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const payload = { nome, matricula, curso };
      await api.createAluno(payload);
      Alert.alert('✅ Sucesso', 'Estudante cadastrado com sucesso!');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Erro', 'Falha ao cadastrar estudante. Tente novamente.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="person-add" size={32} color="#FDCB6E" />
        <Text style={styles.title}>👨‍🎓 Novo Estudante</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome Completo *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#6C757D" style={styles.inputIcon} />
            <TextInput 
              value={nome} 
              onChangeText={setNome} 
              style={styles.input}
              placeholder="Digite o nome completo"
              placeholderTextColor="#6C757D"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Matrícula *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="card" size={20} color="#6C757D" style={styles.inputIcon} />
            <TextInput 
              value={matricula} 
              onChangeText={setMatricula} 
              style={styles.input}
              placeholder="Ex: 202400001"
              placeholderTextColor="#6C757D"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Curso *</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="school" size={20} color="#6C757D" style={styles.inputIcon} />
            <TextInput 
              value={curso} 
              onChangeText={setCurso} 
              style={styles.input}
              placeholder="Ex: Engenharia de Software"
              placeholderTextColor="#6C757D"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
          <Text style={styles.saveButtonText}>Cadastrar Estudante</Text>
        </TouchableOpacity>
      </View>
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
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    shadowColor: '#FDCB6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D3436',
    marginTop: 12,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: { 
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#DDD6FE',
    shadowColor: '#FDCB6E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: { 
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#2D3436',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#FDCB6E',
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FDCB6E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
});
