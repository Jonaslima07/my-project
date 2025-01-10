import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Produtos from '@/components/Produtos';
import ProdutoModal from '@/components/modal/ProdutoModal';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ProdutoModal />
      <Produtos />
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});