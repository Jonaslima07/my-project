import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <SafeAreaView style={styles.footerContainer}>
      <Text style={styles.footerText}>Estamos localizados:</Text>
      <Text style={styles.locationText}>Av. Dom Pedro II, Centro</Text>
      <Text style={styles.locationText}>Guarabira - PB</Text>
      <Text style={styles.locationText}>CEP: 58200-000</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: 'green',
    padding: 3,
    alignItems: 'center',
    width: "100%",
    
  },
  footerText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  locationText: {
    color: '#fff',
    fontSize: 15,
  },
});

export default Footer;