import { ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProdutosDetails from '../screen/ProdutosDetails';


export default function AppScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Header />
        <ProdutosDetails />
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
  },
});
