import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import disciplinaService from '../service/disciplinaService';
import alunoService from '../service/alunoService';
import matriculaService from '../service/matriculaService';
import { Disciplina, Aluno, MatriculaAluno } from '../service/types';

interface ProfessorHomeProps {
  onLogout: () => void;
  onNavigateToNotas: () => void;
  onNavigateToMatriculas: () => void;
  onNavigateToNotifications: () => void;
}

export default function ProfessorHome({ onLogout, onNavigateToNotas, onNavigateToMatriculas, onNavigateToNotifications }: ProfessorHomeProps) {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [matriculas, setMatriculas] = useState<MatriculaAluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'disciplina' | 'aluno' | 'matricula' | null>(null);
  const [newDisciplina, setNewDisciplina] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [disciplinasData, alunosData, matriculasData] = await Promise.all([
        disciplinaService.list(),
        alunoService.list(),
        matriculaService.list(),
      ]);
      
      setDisciplinas(disciplinasData);
      setAlunos(alunosData);
      setMatriculas(matriculasData);
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao carregar dados');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: async () => {
            await AsyncStorage.multiRemove(['authToken', 'userType']);
            onLogout();
          }
        }
      ]
    );
  };

  const handleCreateDisciplina = async () => {
    if (!newDisciplina.trim()) {
      Alert.alert('Erro', 'Digite a descrição da disciplina');
      return;
    }

    try {
      await disciplinaService.create({ descricao: newDisciplina });
      Alert.alert('Sucesso', 'Disciplina criada com sucesso');
      setNewDisciplina('');
      setModalVisible(false);
      loadData();
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao criar disciplina');
    }
  };

  const handleDeleteDisciplina = (id: number, descricao: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir a disciplina "${descricao}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await disciplinaService.delete(id);
              Alert.alert('Sucesso', 'Disciplina excluída com sucesso');
              loadData();
            } catch (error: any) {
              Alert.alert('Erro', 'Erro ao excluir disciplina');
            }
          }
        }
      ]
    );
  };

  const openModal = (type: 'disciplina' | 'aluno' | 'matricula') => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType(null);
    setNewDisciplina('');
  };

  const renderDisciplina = ({ item }: { item: Disciplina }) => (
    <View style={styles.listItem}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.descricao}</Text>
        <Text style={styles.itemSubtitle}>ID: {item.id}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteDisciplina(item.id, item.descricao)}
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  const renderAluno = ({ item }: { item: Aluno }) => (
    <View style={styles.listItem}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>{item.usuario.nome}</Text>
        <Text style={styles.itemSubtitle}>
          {item.usuario.email} - Matrícula: {item.matricula}
        </Text>
      </View>
    </View>
  );

  const renderMatricula = ({ item }: { item: MatriculaAluno }) => (
    <View style={styles.listItem}>
      <View style={styles.itemContent}>
        <Text style={styles.itemTitle}>
          {item.aluno.usuario.nome} - {item.disciplina.descricao}
        </Text>
        <Text style={styles.itemSubtitle}>
          Nota: {item.nota ? item.nota.toFixed(1) : 'N/A'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portal do Professor</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Disciplinas</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => openModal('disciplina')}
            >
              <Text style={styles.addButtonText}>+ Adicionar</Text>
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <Text style={styles.loadingText}>Carregando...</Text>
          ) : (
            <FlatList
              data={disciplinas}
              renderItem={renderDisciplina}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Nenhuma disciplina encontrada</Text>
              }
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alunos</Text>
          <FlatList
            data={alunos}
            renderItem={renderAluno}
            keyExtractor={(item) => item.usuarioId.toString()}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum aluno encontrado</Text>
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Matrículas</Text>
          <FlatList
            data={matriculas}
            renderItem={renderMatricula}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhuma matrícula encontrada</Text>
            }
          />
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={loadData}>
          <Text style={styles.refreshButtonText}>Atualizar Dados</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.refreshButton, styles.notificationsButton]} 
          onPress={onNavigateToNotifications}
        >
          <Text style={styles.refreshButtonText}>📬 Gerenciar Notificações</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.refreshButton, styles.notasButton]} 
          onPress={onNavigateToNotas}
        >
          <Text style={styles.refreshButtonText}>Gerenciar Notas</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.refreshButton, styles.matriculasButton]} 
          onPress={onNavigateToMatriculas}
        >
          <Text style={styles.refreshButtonText}>Matricular Alunos</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para criar disciplina */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Disciplina</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Descrição da disciplina"
              value={newDisciplina}
              onChangeText={setNewDisciplina}
              placeholderTextColor="#666"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleCreateDisciplina}
              >
                <Text style={styles.confirmButtonText}>Criar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  notificationsButton: {
    backgroundColor: '#17a2b8',
    marginTop: 10,
  },
  notasButton: {
    backgroundColor: '#ff6b35',
    marginTop: 10,
  },
  matriculasButton: {
    backgroundColor: '#6f42c1',
    marginTop: 10,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  confirmButton: {
    backgroundColor: '#28a745',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});