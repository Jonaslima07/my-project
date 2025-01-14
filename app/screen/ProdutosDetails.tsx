import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { IProdutos } from "@/components/interface/IProdutos";

export default function ProdutoModal() {
  const [visible, setVisible] = useState(false);
  const [nomeProduto, setNomeProduto] = useState("");
  const [marca, setMarca] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [produtos, setProdutos] = useState<IProdutos[]>([]);
  const [numProduto, setNumProduto] = useState(1);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);

  useEffect(() => {
    loadProdutos();
    requestLocation();
  }, []);

  const loadProdutos = async () => {
    try {
      const savedProdutos = await AsyncStorage.getItem("produtos");
      if (savedProdutos) {
        const produtosParsed = JSON.parse(savedProdutos);
        if (Array.isArray(produtosParsed)) {
          setProdutos(produtosParsed);
          const maxNumProduto = Math.max(
            ...produtosParsed.map((produto: IProdutos) => produto.numProduto),
            0
          );
          setNumProduto(maxNumProduto + 1);
        }
      }
    } catch (error) {
      console.log("Erro ao carregar produtos:", error);
    }
  };

  const requestLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Erro", "Permissão de localização negada.");
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    setLocation(loc.coords);
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

    const produtoCounter = await AsyncStorage.getItem("produto_counter");
    const nextNumProduto = produtoCounter ? parseInt(produtoCounter) + 1 : 1;

    const novoProduto: IProdutos = {
      numProduto: nextNumProduto,
      nome: nomeProduto,
      marca,
      descricao,
      valor: parseFloat(valor),
      preco: 0,
      localizacao: location
        ? `${location.latitude}, ${location.longitude}`
        : "Não disponível",
      id: 0
    };

    const novosProdutos = [...produtos, novoProduto];
    setProdutos(novosProdutos);
    saveProdutos(novosProdutos);

    await AsyncStorage.setItem("produto_counter", nextNumProduto.toString());

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
        keyExtractor={(item) => item.numProduto.toString()}
        renderItem={({ item }) => (
          <View style={styles.personContainer}>
            <Text style={styles.personDescription}>Produto #{item.numProduto}</Text>
            <Text style={styles.personDescription}>Nome: {item.nome}</Text>
            <Text style={styles.personDescription}>Marca: {item.marca}</Text>
            <Text style={styles.personDescription}>Descrição: {item.descricao}</Text>
            <Text style={styles.personDescription}>
              Valor: R${item.valor && !isNaN(item.valor) ? item.valor.toFixed(2) : "Valor inválido"}
            </Text>
            <Text style={styles.personDescription}>Localização: {item.localizacao}</Text>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
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
    flex: 1,
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
    marginBottom: 15,
    marginTop: 15,
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
    paddingTop: 0,
  },
  personContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    elevation: 1,
    width: "100%",
    position: "relative",
    marginTop: 10,
  },
  personDescription: {
    fontSize: 14,
    color: "#555",
  },
});
