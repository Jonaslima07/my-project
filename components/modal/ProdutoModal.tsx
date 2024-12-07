import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Alert, FlatList } from "react-native";
import * as Location from "expo-location";
import { IProdutos } from "@/components/interface/IProdutos";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

export default function ProdutoModal() {
  const [visible, setVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState('');
  const [preco, setPreco] = useState<number>(0);
  const [descricao, setDescricao] = useState("");
  const [produtos, setProdutos] = useState<IProdutos[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const [localizacao, setLocalizacao] = useState<string>(''); 

  
  const obterLocalizacao = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permissão negada", "Para acessar sua localização, a permissão é necessária.");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    setLocalizacao(`Latitude: ${latitude}, Longitude: ${longitude}`);
  };

  
  const loadProdutos = async () => {
    try {
      const savedProdutos = await AsyncStorage.getItem('produtos');
      if (savedProdutos) {
        setProdutos(JSON.parse(savedProdutos));
      }
    } catch (error) {
      console.log("Erro ao carregar produtos:", error);
    }
  };

  
  const saveProdutos = async (produtos: IProdutos[]) => {
    try {
      await AsyncStorage.setItem('produtos', JSON.stringify(produtos));
    } catch (error) {
      console.log("Erro ao salvar produtos:", error);
    }
  };

  const handleAddOrUpdate = () => {
    if (nome.trim() === "" || descricao.trim() === "") {
      Alert.alert("Preencha todos os campos para prosseguir!");
      return;
    }

    const novoProduto: IProdutos = {
      nome,
      descricao,
      marca,
      preco,
      localizacao,
    };

    let updatedProdutos = [...produtos];
    if (index !== null) {
      updatedProdutos[index] = novoProduto;
    } else {
      updatedProdutos.push(novoProduto);
    }

    setProdutos(updatedProdutos);
    saveProdutos(updatedProdutos); 
    resetForm();
  };

  const resetForm = () => {
    setNome("");
    setDescricao("");
    setMarca("");
    setPreco(0);
    setLocalizacao('');
    setVisible(false);
    setIndex(null);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleDeleteProduto = (index: number) => {
    Alert.alert(
      "Confirmar Exclusão",
      "Você tem certeza de que deseja excluir este produto?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          onPress: () => {
            const updatedProdutos = produtos.filter((_, i) => i !== index);
            setProdutos(updatedProdutos);
            saveProdutos(updatedProdutos); 
          },
        },
      ]
    );
  };

  const handleEdit = (index: number) => {
    const produto = produtos[index];
    setNome(produto.nome);
    setDescricao(produto.descricao);
    setMarca(produto.marca);
    setPreco(produto.preco);
    setLocalizacao(produto.localizacao);
    setVisible(true);
    setIndex(index);
  };

  useEffect(() => {
    loadProdutos(); 
  }, []);

  useEffect(() => {
    if (visible) {
      obterLocalizacao();
    }
  }, [visible]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {index !== null ? "Editar Produto" : "Adicionar Produto"}
            </Text>

            <TextInput
              style={styles.textInput}
              placeholder="Nome do Produto"
              value={nome}
              onChangeText={setNome}
              autoFocus
            />

            <TextInput
              style={styles.textInput}
              placeholder="Descrição"
              value={descricao}
              onChangeText={setDescricao}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Marca"
              value={marca}
              onChangeText={setMarca}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Preço"
              value={preco.toString()}
              onChangeText={(text) => {
                const parsedPrice = parseFloat(text);
                if (!isNaN(parsedPrice)) {
                  setPreco(parsedPrice);
                }
              }}
              keyboardType="numeric"
            />
            
            <Text style={styles.textInput}>Localização: {localizacao}</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.addButtonModal}
                onPress={handleAddOrUpdate}
              >
                <Text style={styles.buttonText}>
                  {index !== null ? "Atualizar" : "Adicionar"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButtonModal}
                onPress={handleCancel}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        style={styles.listContainer}
        data={produtos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.personContainer}>
            <Text style={styles.personName}>{item.nome}</Text>
            <Text style={styles.personDescription}>{item.descricao}</Text>
            <Text style={styles.personDescription}>Marca: {item.marca}</Text>
            <Text style={styles.personDescription}>Preço: R${item.preco}</Text>
            <Text style={styles.personDescription}>Localização: {item.localizacao}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteProduto(index)}
              >
                <Text style={styles.deleteButtonText}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEdit(index)}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    width: 40,
    height: 40,
    bottom: -3,
    left: 170,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
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
  
  addButtonModal: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    marginTop: 30,
    width: "100%",
  },
  personContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    elevation: 1,
  },
  personName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
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
    width: "20%",
    marginHorizontal: 100,
  },
  editButton: {
    backgroundColor: "blue",
    paddingVertical: 8,
    borderRadius: 50,
    alignItems: "center",
    width: "20%", 
    marginHorizontal: -90,
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