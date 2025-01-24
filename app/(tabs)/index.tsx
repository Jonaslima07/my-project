import { ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Body from '@/components/Body';



export default function AppScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Header />
        <Body />
        <Footer />
      </ScrollView>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  scrollViewContent: {
    marginTop:21,
  },
});
