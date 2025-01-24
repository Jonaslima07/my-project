import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { IProdutos } from "@/components/interface/IProdutos";
import { useRouter } from "expo-router";
import Header from "@/components/Header";

export default function ProdutosList() {
  const [visible, setVisible] = useState(false);
  const [nomeProduto, setNomeProduto] = useState("");
  const [marca, setMarca] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [produtos, setProdutos] = useState<IProdutos[]>([]);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const router = useRouter();

  useEffect(() => {
    loadProdutos();
  }, []);

  useEffect(() => {
    if (visible) {
      requestLocation();
    }
  }, [visible]);

  const loadProdutos = async () => {
    try {
      const savedProdutos = await AsyncStorage.getItem("produtos");
      if (savedProdutos) {
        const produtosParsed = JSON.parse(savedProdutos);
        if (Array.isArray(produtosParsed)) {
          setProdutos(produtosParsed);
        }
      }
    } catch (error) {
      console.log("Erro ao carregar produtos:", error);
    }
  };

  const requestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Erro", "Permissão de localização negada.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter a localização.");
      console.error(error);
    }
  };

  const saveProdutos = async (produtos: IProdutos[]) => {
    try {
      await AsyncStorage.setItem("produtos", JSON.stringify(produtos));
    } catch (error) {
      console.log("Erro ao salvar produtos:", error);
    }
  };

  const handleAddProduto = async () => {
    if (!nomeProduto || !descricao || !marca || isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }

    const novoProduto: IProdutos = {
      id: produtos.length + 1,
      nome: nomeProduto,
      marca,
      descricao,
      valor: parseFloat(valor),
      preco: 0,
      localizacao: location ? `${location.latitude}, ${location.longitude}` : "Não disponível",
    };

    const novosProdutos = [...produtos, novoProduto];
    setProdutos(novosProdutos);
    saveProdutos(novosProdutos);

    resetForm();
  };

  const resetForm = () => {
    setNomeProduto("");
    setMarca("");
    setDescricao("");
    setValor("");
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <Header/>
      <TouchableOpacity style={styles.addButton} onPress={() => setVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Novo Produto</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nome do Produto"
              value={nomeProduto}
              onChangeText={setNomeProduto}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Marca"
              value={marca}
              onChangeText={setMarca}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Valor"
              value={valor}
              onChangeText={setValor}
              keyboardType="numeric"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveButtonModal} onPress={handleAddProduto}>
                <Text style={styles.buttonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButtonModal} onPress={resetForm}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/screen/ProdutosCrud?id=${item.id}`)}
          >
          <View style={styles.personContainer}>
            <Text style={styles.personDescription}>Produto #{item.id}</Text>
            <Text style={styles.personDescription}>Nome: {item.nome}</Text>
            <Text style={styles.personDescription}>Marca: {item.marca}</Text>
            <Text style={styles.text}>...</Text>
          </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.cardContainer}
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ccc",
    paddingTop: 15,
    flex:1,
    marginTop:10,
    
  },
  card: {
    top:0,
  },
  text:{
    fontWeight:'bold',
    fontSize:17,
  },
  addButton: {
    backgroundColor: "#4CAF50",
    width: 50,
    height: 50,
    bottom: 10,
    left: 150,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    marginBottom: 45,
    marginTop: 45,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
  },
  saveButtonModal: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 0,
    alignItems: "center",
  },
  cancelButtonModal: {
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardContainer: {
    alignItems: "center",
    
  },
  personContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#black",
    elevation: 1,
    width: 300,
    position: "fixed",
    marginTop: 30,
    bottom:30,
  },
  personDescription: {
    fontSize: 14,
    color: "#555",
  },
});
