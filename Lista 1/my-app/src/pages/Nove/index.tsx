import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";

import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";

export default function Nove() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [resultado, setResultado] = useState("");

  const handleCadastro = () => {
    if (senha === confSenha) {
      setResultado(`${email} - ${senha}`);
    } else {
      setResultado("Erro: senhas não conferem!");
    }
  };

  const [selectedLanguage, setSelectedLanguage] = useState();

  <Picker
    selectedValue={selectedLanguage}
    onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
  ></Picker>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>CADASTRO</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu e-mail"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          placeholder="Digite sua senha"
          secureTextEntry={true}
          maxLength={8}
        />

        <Text style={styles.label}>Confirmação da senha</Text>
        <TextInput
          style={styles.input}
          value={confSenha}
          onChangeText={setConfSenha}
          placeholder="Confirme sua senha"
          secureTextEntry={true}
          maxLength={8}
        />

        <Text style={styles.label}>Função</Text>
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedLanguage(itemValue)
          }
          style={styles.picker}
        >
          <Picker.Item label="Administrador" value="admin" />
          <Picker.Item label="Gestor" value="manager" />
          <Picker.Item label="Usuário" value="user" />
        </Picker>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonCadastro}
            onPress={handleCadastro}
          >
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonLogin}>
            <Text style={styles.buttonText}>Logar</Text>
          </TouchableOpacity>
        </View>
        {resultado ? <Text style={styles.result}>{resultado}</Text> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 15,
    width: "90%",
    maxWidth: 270,
    backgroundColor: "#333",
  },
  title: {
    color: "#ff9800",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  label: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  buttonCadastro: {
    backgroundColor: "#ff9800",
    padding: 12,
    borderRadius: 4,
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },
  buttonLogin: {
    backgroundColor: "#ff9800",
    padding: 12,
    borderRadius: 4,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  result: {
    marginTop: 10,
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },

  picker: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    marginBottom: 15,
    
  },
});
