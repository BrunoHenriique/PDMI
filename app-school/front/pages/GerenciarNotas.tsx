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
import disciplinaService from '../service/disciplinaService';
import matriculaService from '../service/matriculaService';
import { Disciplina, MatriculaAluno } from '../service/types';

interface GerenciarNotasProps {
  onBack: () => void;
}

export default function GerenciarNotas({ onBack }: GerenciarNotasProps) {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);
  const [matriculas, setMatriculas] = useState<MatriculaAluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMatricula, setSelectedMatricula] = useState<MatriculaAluno | null>(null);
  const [novaNota, setNovaNota] = useState('');

  useEffect(() => {
    loadDisciplinas();
  }, []);

  const loadDisciplinas = async () => {
    setLoading(true);
    try {
      const data = await disciplinaService.list();
      setDisciplinas(data);
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao carregar disciplinas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMatriculasPorDisciplina = async (disciplina: Disciplina) => {
    setLoading(true);
    try {
      const data = await matriculaService.getByDisciplina(disciplina.id);
      setMatriculas(data);
      setSelectedDisciplina(disciplina);
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao carregar matrículas');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNota = (matricula: MatriculaAluno) => {
    setSelectedMatricula(matricula);
    setNovaNota(matricula.nota ? matricula.nota.toString() : '');
    setModalVisible(true);
  };

  const salvarNota = async () => {
    if (!selectedMatricula) return;
    
    const nota = parseFloat(novaNota);
    if (isNaN(nota) || nota < 0 || nota > 10) {
      Alert.alert('Erro', 'Digite uma nota válida entre 0 e 10');
      return;
    }

    try {
      await matriculaService.update(selectedMatricula.id, nota);
      Alert.alert('Sucesso', 'Nota atualizada com sucesso!');
      setModalVisible(false);
      setSelectedMatricula(null);
      setNovaNota('');
      
      // Recarregar matrículas
      if (selectedDisciplina) {
        loadMatriculasPorDisciplina(selectedDisciplina);
      }
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao salvar nota');
      console.error(error);
    }
  };

  const renderDisciplina = ({ item }: { item: Disciplina }) => (
    <TouchableOpacity
      style={styles.disciplinaItem}
      onPress={() => loadMatriculasPorDisciplina(item)}
    >
      <Text style={styles.disciplinaNome}>{item.descricao}</Text>
      <Text style={styles.arrow}>→</Text>
    </TouchableOpacity>
  );

  const renderMatricula = ({ item }: { item: MatriculaAluno }) => (
    <View style={styles.matriculaItem}>
      <View style={styles.alunoInfo}>
        <Text style={styles.alunoNome}>{item.aluno?.usuario?.nome || 'Aluno'}</Text>
        <Text style={styles.alunoMatricula}>Mat: {item.aluno?.matricula || 'N/A'}</Text>
      </View>
      <View style={styles.notaContainer}>
        <Text style={styles.notaLabel}>Nota:</Text>
        <Text style={[
          styles.notaValor,
          item.nota ? (item.nota >= 7 ? styles.notaAprovado : styles.notaReprovado) : styles.notaSemNota
        ]}>
          {item.nota ? item.nota.toFixed(1) : 'N/A'}
        </Text>
        <TouchableOpacity
          style={styles.editarButton}
          onPress={() => abrirModalNota(item)}
        >
          <Text style={styles.editarButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gerenciar Notas</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        {!selectedDisciplina ? (
          <View>
            <Text style={styles.sectionTitle}>Selecione uma Disciplina</Text>
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
        ) : (
          <View>
            <TouchableOpacity
              style={styles.voltarDisciplinas}
              onPress={() => {
                setSelectedDisciplina(null);
                setMatriculas([]);
              }}
            >
              <Text style={styles.voltarText}>← Voltar para Disciplinas</Text>
            </TouchableOpacity>
            
            <Text style={styles.sectionTitle}>{selectedDisciplina?.descricao || 'Disciplina'}</Text>
            <Text style={styles.subtitle}>Alunos Matriculados</Text>
            
            {loading ? (
              <Text style={styles.loadingText}>Carregando...</Text>
            ) : (
              <FlatList
                data={matriculas}
                renderItem={renderMatricula}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                ListEmptyComponent={
                  <Text style={styles.emptyText}>Nenhum aluno matriculado</Text>
                }
              />
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal para editar nota */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Nota</Text>
            
            {selectedMatricula && (
              <View style={styles.alunoModalInfo}>
                <Text style={styles.alunoModalNome}>
                  {selectedMatricula.aluno?.usuario?.nome || 'Aluno'}
                </Text>
                <Text style={styles.disciplinaModalNome}>
                  {selectedMatricula.disciplina?.descricao || 'Disciplina'}
                </Text>
              </View>
            )}
            
            <TextInput
              style={styles.notaInput}
              placeholder="Digite a nota (0-10)"
              value={novaNota}
              onChangeText={setNovaNota}
              keyboardType="numeric"
              placeholderTextColor="#666"
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setNovaNota('');
                  setSelectedMatricula(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={salvarNota}
              >
                <Text style={styles.confirmButtonText}>Salvar</Text>
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
  backButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 15,
  },
  disciplinaItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
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
  disciplinaNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  arrow: {
    fontSize: 20,
    color: '#28a745',
    fontWeight: 'bold',
  },
  voltarDisciplinas: {
    marginBottom: 20,
  },
  voltarText: {
    color: '#28a745',
    fontSize: 16,
    fontWeight: '600',
  },
  matriculaItem: {
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
  alunoInfo: {
    flex: 1,
  },
  alunoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  alunoMatricula: {
    fontSize: 14,
    color: '#666',
  },
  notaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notaLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  notaValor: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 40,
    textAlign: 'center',
  },
  notaAprovado: {
    color: '#28a745',
  },
  notaReprovado: {
    color: '#dc3545',
  },
  notaSemNota: {
    color: '#666',
  },
  editarButton: {
    backgroundColor: '#007AFF',
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editarButtonText: {
    fontSize: 16,
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
  alunoModalInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  alunoModalNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  disciplinaModalNome: {
    fontSize: 14,
    color: '#666',
  },
  notaInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
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