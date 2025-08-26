import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();

  const botoes = [
    { label: "Um", route: "Um" },
    { label: "Dois", route: "Dois" },
    { label: "Três", route: "Tres" },
    { label: "Quatro", route: "Quatro" },
    { label: "Cinco", route: "Cinco" },
    { label: "Seis", route: "Seis" },
    { label: "Sete", route: "Sete" },
    { label: "Oito", route: "Oito" },
    { label: "Nove", route: "Nove" },
    { label: "Dez", route: "Dez" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../../assets/Fatec_jac.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>Inicio</Text>
        <View style={styles.grid}>
          {botoes.map((botao) => (
            <TouchableOpacity
              key={botao.route}
              style={styles.button}
              onPress={() => navigation.navigate(botao.route as never)}
            >
              <Text style={styles.buttonText}>{botao.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#ff9800",
    paddingVertical: 12,
    borderRadius: 6,
    margin: 5,
    width: "40%", // garante 2 colunas
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
