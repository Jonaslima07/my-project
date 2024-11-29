import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VendaModal from '@/components/modal/VendaModal';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <VendaModal />
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
