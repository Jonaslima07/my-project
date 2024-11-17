import React from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

const carouselData = [
  { id: '1', image: 'https://plus.unsplash.com/premium_photo-1680985551009-05107cd2752c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y2VsbCUyMHBob25lfGVufDB8fDB8fHww', title: 'Iphone 14' },
  { id: '2', image: 'https://images.unsplash.com/photo-1498582801152-3ebe4158143e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGNlbGwlMjBwaG9uZXxlbnwwfHwwfHx8MA%3D%3D', title: 'Lanterninha Nokia' },
  { id: '3', image: 'https://plus.unsplash.com/premium_photo-1681305757960-8346c233ff4b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2VsbCUyMHBob25lfGVufDB8fDB8fHww', title: 'Iphone 11' },
  { id: '4', image: 'https://images.unsplash.com/photo-1691449808001-bb8c157f0094?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2Ftc3VuZyUyMHBob25lfGVufDB8fDB8fHww', title: 'Samsung Galaxy' },
];

const Produtos = () => {
  return (
    <View style={styles.container}>
      
      <Text style={styles.header}>
      Nossa loja nasceu com o propósito de oferecer o melhor da tecnologia aos nossos clientes.
      Desde a era dos primeiros celulares até os smartphones de última geração, acompanhamos de perto a evolução tecnológica.  
      Com uma trajetória marcada pela inovação, buscamos sempre oferecer produtos de alta qualidade e das marcas mais renomadas do mercado.{'\n'} 
      Confira nosso catálogo disponível
      São dos mais variados e maiores marcas do mercado, venha conferir!
      </Text>
      
      <FlatList
        data={carouselData}
        renderItem={({ item }) => (
          <View style={styles.carouselItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.itemTitle}>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20, 
  },
  
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 1, 
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 10, 
  },
  carouselContainer: {
    paddingVertical: 50, 
  },
  carouselItem: {
    width: 411,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  image: {
    width: 300,
    height: 200,
    borderRadius: 40,
    marginHorizontal: 0,
  },
  itemTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default Produtos