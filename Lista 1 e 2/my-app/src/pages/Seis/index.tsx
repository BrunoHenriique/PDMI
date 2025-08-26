import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Constants from "expo-constants";

export default function Seis() {
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [resultado, setResultado] = useState("");

  const salvar = () => {
    if (nome && idade) {
      setResultado(`${nome} - ${idade}`);
    } else {
      setResultado("Preencha todos os campos!");
    }
  };

  return (
    <View style={styles.container}>
      <Text>Nome</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite seu nome"
      />

      <Text>Idade</Text>
      <TextInput
        style={styles.input}
        value={idade}
        onChangeText={setIdade}
        placeholder="Digite sua idade"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={salvar}>
        <Text style={styles.buttonText}>SALVAR</Text>
      </TouchableOpacity>

      {resultado ? <Text style={styles.result}>{resultado}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    padding: 20,
    paddingTop: Constants.statusBarHeight,
    justifyContent: "center",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  result: {
    fontSize: 16,
    color: "#fff",
  },
});
