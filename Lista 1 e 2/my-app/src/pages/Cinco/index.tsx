import React from "react";
import { View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import Constants from "expo-constants";

import logo from "../../assets/imagem_png.png";

export default function Cinco() {
  const showAlert = () => {
    Alert.alert("Boa noite!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.left}>
          <TouchableOpacity onPress={showAlert}>
            <Image source={logo} style={styles.image} resizeMode="contain" />
          </TouchableOpacity>
        </View>
        <View style={styles.right}>
          <View style={styles.rightTop}>
            <TouchableOpacity onPress={showAlert}>
              <Image source={logo} style={styles.image} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          <View style={styles.rightBottom}>
            <TouchableOpacity onPress={showAlert}>
              <Image source={logo} style={styles.image} resizeMode="contain" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity onPress={showAlert}>
          <Image source={logo} style={styles.image} resizeMode="contain" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingTop: Constants.statusBarHeight,
  },
  top: {
    flex: 0.5,
    flexDirection: "row",
    backgroundColor: "crimson",
  },
  right: {
    flex: 0.5,
    backgroundColor: "aquamarine",
  },
  left: {
    flex: 0.5,
    backgroundColor: "lime",
    justifyContent: "center",
    alignItems: "center",
  },
  rightTop: {
    flex: 0.5,
    backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center",
  },
  rightBottom: {
    flex: 0.5,
    backgroundColor: "skyblue",
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    flex: 0.5,
    backgroundColor: "salmon",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: 64,
    height: 64,
  },
});
