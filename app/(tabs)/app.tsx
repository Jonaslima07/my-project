import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import Header from '@/components/Header';  
import Footer from '@/components/Footer';
import Produtos from '@/components/Produtos';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <Produtos />
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  stepContainer: {
    marginVertical: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -145 }],
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});
