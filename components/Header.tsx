import React from "react";
import {SafeAreaView,  StyleSheet, Image, Text } from "react-native";

export default function Header() {
  return (
    <SafeAreaView style={styles.container}>
      <Image 
        source={require('../assets/images/JLCell.jpg')} 
        style={styles.image} 
      />
      
     <SafeAreaView style={styles.textContainer}>
        <Text style={styles.text}>JL Cell</Text>
     </SafeAreaView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", 
    justifyContent: "flex-start", 
    alignItems: "center",
    backgroundColor: "green",
    height: 110,
  },
  image: {
    width: 120,
    height: 120,
    marginRight: 90, 
  },
  navText: {
    color: "#fff", 
    fontSize: 20,
  },
  text: {
    alignItems: "center",
    color: "#fff",
    fontSize: 28,
  },
  textContainer: {
    alignItems: "center"
  }
});


