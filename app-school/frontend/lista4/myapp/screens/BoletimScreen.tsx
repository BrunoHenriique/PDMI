import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

export default function BoletimScreen() {
  const [alunoId, setAlunoId] = useState('');
  const [boletim, setBoletim] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarBoletim = async () => {
    if (!alunoId.trim()) {
      Alert.alert('⚠️ Atenção', 'Informe o ID do estudante para consultar o relatório acadêmico.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.boletimByAluno(Number(alunoId));
      setBoletim(res.data || []);
    } catch (err: any) {
      console.error(err);
      Alert.alert('❌ Erro', err?.response?.data?.message || 'Falha ao buscar relatório');
    } finally {
      setLoading(false);
    }
  };

  const getNotaColor = (nota: number) => {
    if (nota >= 8) return '#00B894';
    if (nota >= 6) return '#FDCB6E';
    return '#E74C3C';
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="book" size={20} color="#6C5CE7" />
        <Text style={styles.materia}>{item.disciplina_nome}</Text>
      </View>
      <View style={styles.notasContainer}>
        <View style={styles.notaItem}>
          <Text style={styles.notaLabel}>1ª Avaliação</Text>
          <Text style={[styles.notaValue, { color: getNotaColor(item.nota1) }]}>
            {item.nota1}
          </Text>
        </View>
        <View style={styles.notaItem}>
          <Text style={styles.notaLabel}>2ª Avaliação</Text>
          <Text style={[styles.notaValue, { color: getNotaColor(item.nota2) }]}>
            {item.nota2}
          </Text>
        </View>
        <View style={[styles.notaItem, styles.mediaItem]}>
          <Text style={styles.mediaLabel}>Média Final</Text>
          <Text style={[styles.mediaValue, { color: getNotaColor(item.media) }]}>
            {item.media}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="analytics" size={32} color="#6C5CE7" />
        <Text style={styles.title}>📊 Relatório Acadêmico</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <Text style={styles.label}>ID do Estudante</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="search" size={20} color="#6C757D" style={styles.inputIcon} />
          <TextInput
            value={alunoId}
            onChangeText={setAlunoId}
            style={styles.input}
            keyboardType="numeric"
            placeholder="Digite o ID do estudante (ex: 1)"
            placeholderTextColor="#6C757D"
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={buscarBoletim} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Ionicons name="search" size={20} color="#FFFFFF" />
              <Text style={styles.searchButtonText}>Buscar Relatório</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {boletim.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#B2BEC3" />
          <Text style={styles.emptyText}>Nenhum relatório encontrado</Text>
          <Text style={styles.emptySubtext}>Digite um ID válido e tente novamente</Text>
        </View>
      ) : (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>🎓 Desempenho Acadêmico</Text>
          <FlatList
            data={boletim}
            keyExtractor={(item) => String(item.disciplina_id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
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
    shadowColor: '#6C5CE7',
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
  searchContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  label: { 
    fontSize: 16,
    fontWeight: '700',
    color: '#2D3436',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#DDD6FE',
    marginBottom: 16,
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
  searchButton: {
    backgroundColor: '#6C5CE7',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#636E72',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#B2BEC3',
    marginTop: 8,
    textAlign: 'center',
  },
  resultsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#2D3436',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  materia: { 
    fontSize: 18,
    fontWeight: '700',
    color: '#2D3436',
    marginLeft: 12,
    flex: 1,
  },
  notasContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notaItem: {
    alignItems: 'center',
    flex: 1,
  },
  mediaItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  notaLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#636E72',
    marginBottom: 4,
  },
  notaValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  mediaLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6C5CE7',
    marginBottom: 4,
  },
  mediaValue: {
    fontSize: 24,
    fontWeight: '900',
  },
});
