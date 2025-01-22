import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { IProdutos } from "@/components/interface/IProdutos";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ProdutosCrud() {
  const [visible, setVisible] = useState(false);
  const [nomeProduto, setNomeProduto] = useState("");
  const [marca, setMarca] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [produtos, setProdutos] = useState<IProdutos[]>([]);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const { id } = useLocalSearchParams(); 
  const router = useRouter();

  useEffect(() => {
    loadProdutos();
  }, []);

  useEffect(() => {
    if (visible) {
      requestLocation();
    }
  }, [visible]);

  useEffect(() => {
    if (id) {
      loadProdutos(Number(id));
    }
  }, [id]);

  const loadProdutos = async (id?: number) => {
    try {
      const savedProdutos = await AsyncStorage.getItem("produtos");
      if (savedProdutos) {
        const produtosParsed = JSON.parse(savedProdutos);
        if (Array.isArray(produtosParsed)) {
          if (id) {
            const produto = produtosParsed.find((p: IProdutos) => p.id === id);
            if (produto) {
              setProdutos([produto]);
            } else {
              Alert.alert("Erro", "Produto não encontrado.");
            }
          } else {
            setProdutos(produtosParsed);
          }
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

  const handleDeleteProduto = async () => {
    if (!id) {
      Alert.alert("Erro", "Produto não encontrado.");
      return;
    }
  
    const idNumber = Number(id);
    
   
    const novosProdutos = produtos.filter((produto) => produto.id !== idNumber);
  
   
    await saveProdutos(novosProdutos);
  
    
    setProdutos(novosProdutos);
  
   
    router.push("/Produtos");
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

  const handleEditProduto = (produto: IProdutos) => {
    setNomeProduto(produto.nome);
    setMarca(produto.marca);
    setDescricao(produto.descricao);
    setValor(produto.valor.toString());
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      
      {id && (
        <TouchableOpacity style={styles.deleteButtonHeader} onPress={handleDeleteProduto}>
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      )}

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
              <TouchableOpacity
                style={styles.saveButtonModal}
                onPress={handleAddProduto}
              >
                <Text style={styles.buttonText}>Salvar</Text>
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.personContainer}>
            <Text style={styles.personDescription}>Nome: {item.nome}</Text>
            <Text style={styles.personDescription}>Marca: {item.marca}</Text>
            <Text style={styles.personDescription}>Descrição: {item.descricao}</Text>
            <Text style={styles.personDescription}>
              Valor: R$ {item.valor && !isNaN(item.valor) ? item.valor.toFixed(2) : "Valor inválido"}
            </Text>
            <Text style={styles.personDescription}>Localização: {item.localizacao}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => handleEditProduto(item)}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Editar</Text>
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
    paddingTop: 15,
    flex:1,
  },
  deleteButtonHeader: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginLeft: 100,
    left:78,
    width: 50,
    marginTop: 10,
    alignItems: 'center',
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
    marginTop: 30,
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
    marginBottom: 160,
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
    color: "#black",
    fontSize: 20,
    fontWeight: "bold",
    left: 1,
    alignItems:'center',
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});