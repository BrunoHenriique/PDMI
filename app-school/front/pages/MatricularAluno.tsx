import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import disciplinaService from '../service/disciplinaService';
import alunoService from '../service/alunoService';
import matriculaService from '../service/matriculaService';
import { Disciplina, Aluno, MatriculaAluno } from '../service/types';

interface MatricularAlunoProps {
  onBack: () => void;
}

export default function MatricularAluno({ onBack }: MatricularAlunoProps) {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [matriculas, setMatriculas] = useState<MatriculaAluno[]>([]);
  const [selectedDisciplina, setSelectedDisciplina] = useState<Disciplina | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [alunosDisponiveis, setAlunosDisponiveis] = useState<Aluno[]>([]);

  useEffect(() => {
    loadData();
  }, []);

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

  const selecionarDisciplina = (disciplina: Disciplina) => {
    setSelectedDisciplina(disciplina);
    
    // Filtrar alunos que NÃO estão matriculados nesta disciplina
    const alunosMatriculados = matriculas
      .filter(m => m.disciplinaId === disciplina.id)
      .map(m => m.alunoId);
    
    const alunosNaoMatriculados = alunos.filter(
      aluno => !alunosMatriculados.includes(aluno.usuarioId)
    );
    
    setAlunosDisponiveis(alunosNaoMatriculados);
    setModalVisible(true);
  };

  const matricularAluno = async (aluno: Aluno) => {
    if (!selectedDisciplina) return;
    
    try {
      await matriculaService.create({
        alunoId: aluno.usuarioId,
        disciplinaId: selectedDisciplina.id
      });
      
      Alert.alert('Sucesso', `${aluno.usuario?.nome || 'Aluno'} foi matriculado em ${selectedDisciplina.descricao || 'disciplina'}`);
      setModalVisible(false);
      setSelectedDisciplina(null);
      loadData(); // Recarregar dados
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao matricular aluno');
      console.error(error);
    }
  };

  const obterMatriculasPorDisciplina = (disciplinaId: number) => {
    return matriculas.filter(m => m.disciplinaId === disciplinaId);
  };

  const renderDisciplina = ({ item }: { item: Disciplina }) => {
    const matriculasDisciplina = obterMatriculasPorDisciplina(item.id);
    
    return (
      <View style={styles.disciplinaCard}>
        <View style={styles.disciplinaHeader}>
          <Text style={styles.disciplinaNome}>{item.descricao}</Text>
          <Text style={styles.contadorAlunos}>
            {matriculasDisciplina.length} aluno(s)
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.matricularButton}
          onPress={() => selecionarDisciplina(item)}
        >
          <Text style={styles.matricularButtonText}>+ Matricular Aluno</Text>
        </TouchableOpacity>
        
        {matriculasDisciplina.length > 0 && (
          <View style={styles.alunosMatriculados}>
            <Text style={styles.alunosTitle}>Alunos matriculados:</Text>
            {matriculasDisciplina.map((matricula) => {
              const aluno = alunos.find(a => a.usuarioId === matricula.alunoId);
              return aluno ? (
                <Text key={matricula.id} style={styles.alunoNome}>
                  • {aluno.usuario?.nome || 'Aluno'} (Mat: {aluno.matricula || 'N/A'})
                </Text>
              ) : null;
            })}
          </View>
        )}
      </View>
    );
  };

  const renderAlunoDisponivel = ({ item }: { item: Aluno }) => (
    <TouchableOpacity
      style={styles.alunoItem}
      onPress={() => matricularAluno(item)}
    >
      <View>
        <Text style={styles.alunoModalNome}>{item.usuario?.nome || 'Aluno'}</Text>
        <Text style={styles.alunoModalMatricula}>Matrícula: {item.matricula || 'N/A'}</Text>
        <Text style={styles.alunoModalEmail}>{item.usuario?.email || 'Email'}</Text>
      </View>
      <Text style={styles.adicionarTexto}>Adicionar</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Matricular Alunos</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Disciplinas</Text>
        <Text style={styles.subtitle}>Clique em uma disciplina para matricular alunos</Text>
        
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
      </ScrollView>

      {/* Modal para selecionar aluno */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedDisciplina(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Matricular em: {selectedDisciplina?.descricao || 'Disciplina'}
            </Text>
            
            <Text style={styles.modalSubtitle}>Selecione um aluno:</Text>
            
            {alunosDisponiveis.length === 0 ? (
              <Text style={styles.semAlunosText}>
                Todos os alunos já estão matriculados nesta disciplina
              </Text>
            ) : (
              <FlatList
                data={alunosDisponiveis}
                renderItem={renderAlunoDisponivel}
                keyExtractor={(item) => item.usuarioId.toString()}
                style={styles.alunosList}
                maxHeight={300}
              />
            )}
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setModalVisible(false);
                setSelectedDisciplina(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  disciplinaCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  disciplinaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  disciplinaNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  contadorAlunos: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  matricularButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  matricularButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  alunosMatriculados: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  alunosTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  alunoNome: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
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
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  alunosList: {
    flexGrow: 0,
  },
  alunoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
  },
  alunoModalNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  alunoModalMatricula: {
    fontSize: 14,
    color: '#666',
  },
  alunoModalEmail: {
    fontSize: 14,
    color: '#666',
  },
  adicionarTexto: {
    color: '#007AFF',
    fontWeight: '600',
  },
  semAlunosText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 30,
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});