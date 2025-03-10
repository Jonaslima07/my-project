import React from "react";
import { SafeAreaView, Text, FlatList, Image, StyleSheet } from "react-native";

const carrossel = [
  { id: '1', image: 'data:image/jpeg;base64,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', title: 'Iphone 14' },
  { id: '2', image: 'https://images.unsplash.com/photo-1498582801152-3ebe4158143e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fGNlbGwlMjBwaG9uZXxlbnwwfHwwfHx8MA%3D%3D', title: 'Lanterninha Nokia' },
  { id: '3', image: 'https://plus.unsplash.com/premium_photo-1681305757960-8346c233ff4b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2VsbCUyMHBob25lfGVufDB8fDB8fHww', title: 'Iphone 11' },
  { id: '4', image: 'https://images.unsplash.com/photo-1691449808001-bb8c157f0094?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2Ftc3VuZyUyMHBob25lfGVufDB8fDB8fHww', title: 'Samsung Galaxy' },
  { id: '5', image: 'data:image/jpeg;base64,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', title: 'Motorola G52' },
];

const Body = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>
        Nossa loja nasceu com o propósito de oferecer o melhor da tecnologia aos
        nossos clientes. Desde a era dos primeiros celulares até os smartphones
        de última geração, acompanhamos de perto a evolução tecnológica. Com uma
        trajetória marcada pela inovação, buscamos sempre oferecer produtos de
        alta qualidade e das marcas mais renomadas do mercado.{"\n"}
      </Text>

      <Image
        source={{
          uri: "https://img.freepik.com/fotos-premium/jovem-mulher-sobre-fundo-azul-isolado-segurando-sacolas-de-compras-e-escrever-uma-mensagem-com-o-celular-para-um-amigo_1368-117215.jpg",
          
        }}
        style={styles.image1} 
      />

      <Text style={styles.text1}>
        Quer saber mais sobre nossos produtos? {"\n"}Então confira nosso
        catálogo disponível logo abaixo, são dos mais variados e qualificados do
        mercado, venha conferir!
      </Text>

      <Image
        source={{
          uri: "https://png.pngtree.com/png-vector/20220930/ourmid/pngtree-a-black-woman-doubts-and-thinks-png-image_6239082.png",
        }}
        style={styles.duvida} 
      />

      <FlatList
        data={carrossel}
        renderItem={({ item }) => (
          <SafeAreaView style={styles.carouselItem}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.itemTitle}>{item.title}</Text>
          </SafeAreaView>
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      />

      <Text style={styles.texto}>
      Esses foram apenas alguns dos nossos produtos, e temos muito mais esperando por você! Realizamos suas compras com total segurança e praticidade, garantindo a melhor experiência para nossos clientes. Prezamos pela integridade, responsabilidade e excelência em cada detalhe.
      </Text>

      <Image
        source={require("@/assets/images/vendedor.png")}
        style={styles.imageUrl}
      />

     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30, 
    
  },
  text1: {
    fontWeight: "bold",
    alignItems: "center",
    padding: 20,
    width: 300,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 110,
    bottom: 20,
    left: 43,
  },
  text2: {
    fontWeight: "bold",
    alignItems: "center",
    textAlign: "center",
    fontStyle: "italic",
    marginTop:50,
  },
  texto:{
    fontWeight: "bold",
    width:300,
    alignItems: "center",
    textAlign: "center",
    fontStyle: "italic",
    bottom:20,

  },
  duvida: {
    height: 100,
    width: 100,
    right: 148,
    bottom: 80,
  },

  header: {
    fontSize: 14,
    fontWeight: "bold",
    width: 400,
    marginBottom: 1,
    color: "#333",
    textAlign: "center",
    paddingHorizontal: 10,
    bottom:40,
    marginTop: 40,
    
  },
  carouselContainer: {
    paddingVertical: 100,
  },
  carouselItem: {
    width: 410,
    justifyContent: "center",
    alignItems: "center",
    bottom: 70,
  },
  image: {
    width: 260,
    height: 218,
    borderRadius: 50,
  },
  image1:{
    width: '90%',
    height: 280,
    borderRadius: 50,
    marginTop:20,
  },

  imageUrl: {
    width: 180,
    height: 150,
    left: 118,
    marginTop: 15,
    bottom: 40,
  },
  itemTitle: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Body;
