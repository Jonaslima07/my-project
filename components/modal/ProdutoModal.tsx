import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { IProdutos } from "../interface/IProdutos";

export default function ProdutoModal() {
  const [visible, setVisible] = useState(false);
  const [nomeProduto, setNomeProduto] = useState("");
  const [marca, setMarca] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [produtos, setProdutos] = useState<IProdutos[]>([]);
  const [numProduto, setNumProduto] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editProduto, setEditProduto] = useState<IProdutos | null>(null);
  const [location, setLocation] =
    useState<Location.LocationObjectCoords | null>(null);

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
    if (
      !nomeProduto ||
      !descricao ||
      !marca ||
      isNaN(parseFloat(valor)) ||
      parseFloat(valor) <= 0
    ) {
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
    };
  
    const novosProdutos = [...produtos, novoProduto];
    setProdutos(novosProdutos);
    saveProdutos(novosProdutos);
  
    
    await AsyncStorage.setItem("produto_counter", nextNumProduto.toString());
  
    resetForm();
  };
  

  const handleDeleteProduto = (numProduto: number) => {
    const novosProdutos = produtos.filter(
      (produto) => produto.numProduto !== numProduto
    );
    setProdutos(novosProdutos);
    saveProdutos(novosProdutos);
    resetForm();
  };

  const resetForm = () => {
    setNomeProduto("");
    setMarca("");
    setDescricao("");
    setValor("");
    setEditMode(false);
    setEditProduto(null);
    setVisible(false);
  };

  const handleEditProduto = (produto: IProdutos) => {
    setEditMode(true);
    setEditProduto(produto);
    setNomeProduto(produto.nome);
    setMarca(produto.marca);
    setDescricao(produto.descricao);
    setValor(produto.valor.toString());
    setVisible(true);
  };

  const handleUpdateProduto = async () => {
    if (!editProduto) return;

    const updatedProduto: IProdutos = {
      ...editProduto,
      nome: nomeProduto,
      marca,
      descricao,
      valor: parseFloat(valor),
    };

    const novosProdutos = produtos.map((produto) =>
      produto.numProduto === editProduto.numProduto ? updatedProduto : produto
    );

    setProdutos(novosProdutos);
    saveProdutos(novosProdutos);

    resetForm();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editMode ? "Editar Produto" : "Novo Produto"}
            </Text>
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
              <TouchableOpacity
                style={styles.saveButtonModal}
                onPress={editMode ? handleUpdateProduto : handleAddProduto}
              >
                <Text style={styles.buttonText}>
                  {editMode ? "Atualizar" : "Salvar"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButtonModal}
                onPress={resetForm}
              >
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
            <Text style={styles.personDescription}>
              Produto #{item.numProduto}
            </Text>
            <Text style={styles.personDescription}>Nome: {item.nome}</Text>
            <Text style={styles.personDescription}>Marca: {item.marca}</Text>
            <Text style={styles.personDescription}>
              Descrição: {item.descricao}
            </Text>
            <Text style={styles.personDescription}>
              Valor: R${" "}
              {item.valor && !isNaN(item.valor)
                ? item.valor.toFixed(2)
                : "Valor inválido"}
            </Text>
            <Text style={styles.personDescription}>
              Localização: {item.localizacao}
            </Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => handleEditProduto(item)}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteProduto(item.numProduto)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
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
    padding: 0,
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
  cancelButtonModal: {
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardContainer: {
    alignItems: "center",
    paddingTop:0, 
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 5,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    paddingVertical: 8,
    borderRadius: 50,
    alignItems: "center",
    width: "30%",
  },
  editButton: {
    backgroundColor: "blue",
    paddingVertical: 8,
    borderRadius: 50,
    alignItems: "center",
    width: "30%",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
