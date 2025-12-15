import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import matriculaService from '../service/matriculaService';
import { MatriculaAluno } from '../service/types';

interface AlunoHomeProps {
  onLogout: () => void;
  onNavigateToNotifications: () => void;
  onNavigateToProfile: () => void;
}

export default function AlunoHome({ onLogout, onNavigateToNotifications, onNavigateToProfile }: AlunoHomeProps) {
  const [matriculas, setMatriculas] = useState<MatriculaAluno[]>([]);
  const [loading, setLoading] = useState(false);
  const [alunoId, setAlunoId] = useState<number | null>(null);

  useEffect(() => {
    initializeAluno();
  }, []);

  const initializeAluno = async () => {
    // Em uma implementação real, você deveria armazenar o ID do usuário no login
    // Por enquanto, vamos simular buscando o primeiro aluno ou permitir que o usuário informe
    const storedAlunoId = await AsyncStorage.getItem('alunoId');
    if (storedAlunoId) {
      setAlunoId(parseInt(storedAlunoId));
      loadBoletim(parseInt(storedAlunoId));
    } else {
      // Se não tem ID armazenado, vamos mostrar uma mensagem
      Alert.alert(
        'Configuração Necessária', 
        'ID do aluno não configurado. Entre em contato com o administrador.',
        [{ text: 'OK' }]
      );
    }
  };

  const loadBoletim = async (alunoIdParam: number) => {
    setLoading(true);
    try {
      const data = await matriculaService.getByAluno(alunoIdParam);
      setMatriculas(data);
    } catch (error: any) {
      Alert.alert('Erro', 'Erro ao carregar boletim');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirmar',
      'Deseja realmente sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          onPress: async () => {
            await AsyncStorage.multiRemove(['authToken', 'userType', 'alunoId']);
            onLogout();
          }
        }
      ]
    );
  };

  const calcularMedia = () => {
    const notasValidas = matriculas.filter(m => m.nota !== null && m.nota !== undefined);
    if (notasValidas.length === 0) return 0;
    
    const soma = notasValidas.reduce((acc, m) => acc + (m.nota || 0), 0);
    return soma / notasValidas.length;
  };

  const contarAprovacoes = () => {
    return matriculas.filter(m => m.nota && m.nota >= 7).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Portal do Aluno</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Botões de Navegação */}
        <View style={styles.navigationSection}>
          <TouchableOpacity 
            style={styles.navigationButton} 
            onPress={onNavigateToNotifications}
          >
            <Text style={styles.navigationIcon}>📬</Text>
            <Text style={styles.navigationText}>Notificações</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.navigationButton} 
            onPress={onNavigateToProfile}
          >
            <Text style={styles.navigationIcon}>👤</Text>
            <Text style={styles.navigationText}>Perfil</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.loadingText}>Carregando...</Text>
        ) : (
          <>
            <View style={styles.resumoContainer}>
              <Text style={styles.sectionTitle}>Resumo Acadêmico</Text>
              
              <View style={styles.resumoCards}>
                <View style={styles.resumoCard}>
                  <Text style={styles.resumoNumero}>{matriculas.length}</Text>
                  <Text style={styles.resumoLabel}>Disciplinas</Text>
                </View>
                
                <View style={styles.resumoCard}>
                  <Text style={[styles.resumoNumero, styles.mediaNumero]}>
                    {calcularMedia().toFixed(1)}
                  </Text>
                  <Text style={styles.resumoLabel}>Média Geral</Text>
                </View>
                
                <View style={styles.resumoCard}>
                  <Text style={[styles.resumoNumero, styles.aprovacaoNumero]}>
                    {contarAprovacoes()}
                  </Text>
                  <Text style={styles.resumoLabel}>Aprovações</Text>
                </View>
              </View>
            </View>

            <View style={styles.bulletinContainer}>
              <Text style={styles.sectionTitle}>Meu Boletim</Text>
              
              {matriculas.length === 0 ? (
                <Text style={styles.emptyText}>
                  Você ainda não está matriculado em nenhuma disciplina.
                </Text>
              ) : (
                <View style={styles.gradesContainer}>
                  {matriculas.map((matricula) => (
                    <View key={matricula.id} style={styles.gradeItem}>
                      <View style={styles.disciplinaInfo}>
                        <Text style={styles.disciplineName}>
                          {matricula.disciplina?.descricao || 'Disciplina'}
                        </Text>
                        <Text style={styles.disciplinaId}>
                          ID: {matricula.disciplina?.id || 'N/A'}
                        </Text>
                      </View>
                      
                      <View style={styles.notaContainer}>
                        <Text style={[
                          styles.gradeValue,
                          matricula.nota 
                            ? (matricula.nota >= 7 ? styles.approvedGrade : styles.reprovedGrade)
                            : styles.noGrade
                        ]}>
                          {matricula.nota ? matricula.nota.toFixed(1) : 'N/A'}
                        </Text>
                        
                        <Text style={[
                          styles.statusText,
                          matricula.nota 
                            ? (matricula.nota >= 7 ? styles.approvedStatus : styles.reprovedStatus)
                            : styles.noStatus
                        ]}>
                          {matricula.nota 
                            ? (matricula.nota >= 7 ? 'Aprovado' : 'Reprovado') 
                            : 'Pendente'
                          }
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <TouchableOpacity 
              style={styles.refreshButton} 
              onPress={() => alunoId && loadBoletim(alunoId)}
              disabled={loading || !alunoId}
            >
              <Text style={styles.refreshButtonText}>
                {loading ? 'Carregando...' : 'Atualizar Boletim'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#007AFF',
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
  navigationSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navigationButton: {
    backgroundColor: '#007bff',
    flex: 0.48,
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
  },
  navigationIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  navigationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 50,
  },
  resumoContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  resumoCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resumoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  resumoNumero: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  mediaNumero: {
    color: '#ff6b35',
  },
  aprovacaoNumero: {
    color: '#28a745',
  },
  resumoLabel: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bulletinContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  gradesContainer: {
    marginTop: 10,
  },
  gradeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  disciplinaInfo: {
    flex: 1,
  },
  disciplineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  disciplinaId: {
    fontSize: 12,
    color: '#999',
  },
  notaContainer: {
    alignItems: 'center',
  },
  gradeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  approvedGrade: {
    color: '#28a745',
  },
  reprovedGrade: {
    color: '#dc3545',
  },
  noGrade: {
    color: '#666',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  approvedStatus: {
    color: '#28a745',
  },
  reprovedStatus: {
    color: '#dc3545',
  },
  noStatus: {
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 30,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});