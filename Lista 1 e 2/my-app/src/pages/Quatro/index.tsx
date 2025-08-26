import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Constants from "expo-constants";

import logo from "../../assets/imagem_png.png";

export default function Tres() {
  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={styles.left}>
          <Image source={logo} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.right}>
          <View style={styles.rightTop}>
            <Image source={logo} style={styles.image} resizeMode="contain" />
          </View>
          <View style={styles.rightBottom}>
            <Image source={logo} style={styles.image} resizeMode="contain" />
          </View>
        </View>
      </View>

      <View style={styles.bottom}>
        <Image source={logo} style={styles.image} resizeMode="contain" />
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
  bottom: {
    flex: 0.5,
    backgroundColor: "salmon",
    justifyContent: "center",
    alignItems: "center",
  },
  left: {
    flex: 0.5,
    backgroundColor: "lime",
  },
  right: {
    flex: 0.5,
    backgroundColor: "aquamarine",
  },
  rightTop: {
    flex: 0.5,
    backgroundColor: "teal",
  },
  rightBottom: {
    flex: 0.5,
    backgroundColor: "skyblue",
  },
  image: {
    flex: 1,
    width: "100%",
  },
});
