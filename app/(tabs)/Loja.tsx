import { ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Produtos from '@/components/Produtos';


export default function Loja() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Header />
        <Produtos />
      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    marginBottom: 2,
  },
});
