import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footerContainer}>
      <Text style={styles.footerText}>Estamos localizados:</Text>
      <Text style={styles.locationText}>Na Avenida Paulista, 123</Text>
      <Text style={styles.locationText}>Cidade São Paulo, SP</Text>
      <Text style={styles.locationText}>CEP: 01153-000</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: 'green', 
    padding: 0,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
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
