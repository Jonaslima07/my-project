import React, { useEffect, useState } from "react"; 
import { View, Text, TouchableOpacity, Modal, TextInput, FlatList, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { IVenda } from "@/components/interface/IVenda";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function VendasCrud() {
  const [visible, setVisible] = useState(false);
  const [cliente, setCliente] = useState("");
  const [produto, setProduto] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [valor, setValor] = useState("");
  const [vendas, setVendas] = useState<IVenda[]>([]);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    loadVendas();
  }, []);

  useEffect(() => {
    if (visible) {
      requestLocation();
    }
  }, [visible]);

  useEffect(() => {
    if (id) {
      loadVendas(Number(id));
    }
  }, [id]);

  const loadVendas = async (id?: number) => {
    try {
      const savedVendas = await AsyncStorage.getItem("vendas");
      if (savedVendas) {
        const vendasParsed = JSON.parse(savedVendas);
        if (Array.isArray(vendasParsed)) {
          if (id) {
            const venda = vendasParsed.find((v: IVenda) => v.id === id);
            if (venda) {
              setVendas([venda]);
            } else {
              Alert.alert("Erro", "Venda não encontrada.");
            }
          } else {
            setVendas(vendasParsed);
          }
        }
      }
    } catch (error) {
      console.log("Erro ao carregar vendas:", error);
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

  const saveVendas = async (vendas: IVenda[]) => {
    try {
      await AsyncStorage.setItem("vendas", JSON.stringify(vendas));
    } catch (error) {
      console.log("Erro ao salvar vendas:", error);
    }
  };

  const handleDeleteVenda = async () => {
    if (!id) {
      Alert.alert("Erro", "Venda não encontrada.");
      return;
    }
  
    try {
      const idNumber = Number(id);
      const savedVendas = await AsyncStorage.getItem("vendas");
      if (savedVendas) {
        const vendasParsed = JSON.parse(savedVendas);
        const novasVendas = vendasParsed.filter((venda: IVenda) => venda.id !== idNumber);
  
       
        await AsyncStorage.setItem("vendas", JSON.stringify(novasVendas));
  
       
        setVendas(novasVendas);
  
        Alert.alert("Sucesso", "Venda deletada com sucesso.");
        router.push("/vendas");
      } else {
        Alert.alert("Erro", "Nenhuma venda encontrada para deletar.");
      }
    } catch (error) {
      console.log("Erro ao deletar venda:", error);
      Alert.alert("Erro", "Não foi possível deletar a venda.");
    }
  };
  
  

  const handleAddVenda = async () => {
    if (!cliente || !produto || !quantidade || isNaN(parseFloat(valor)) || parseFloat(valor) <= 0) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }

    const novaVenda: IVenda = {
      id: vendas.length + 1,
      nome: cliente, 
      produto,
      quantidade: parseInt(quantidade),
      valor: parseFloat(valor),
      localizacao: location ? `${location.latitude}, ${location.longitude}` : "Não disponível",
      data: new Date()
    };

    const novasVendas = [...vendas, novaVenda];
    setVendas(novasVendas);
    saveVendas(novasVendas);

    resetForm();
  };

  const resetForm = () => {
    setCliente("");
    setProduto("");
    setQuantidade("");
    setValor("");
    setVisible(false);
  };

  const handleEditVenda = (venda: IVenda) => {
    setCliente(venda.nome);
    setProduto(venda.produto);
    setQuantidade(venda.quantidade.toString());
    setValor(venda.valor.toString());
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      
      {id && (
        <TouchableOpacity style={styles.deleteButtonHeader} onPress={handleDeleteVenda}>
          <Text style={styles.deleteButtonText}>X</Text>
        </TouchableOpacity>
      )}

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Venda</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Cliente"
              value={cliente}
              onChangeText={setCliente}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Produto"
              value={produto}
              onChangeText={setProduto}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Quantidade"
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="numeric"
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
                onPress={handleAddVenda}
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
        data={vendas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.personContainer}>
            <Text style={styles.personDescription}>Nome: {item.nome}</Text>
            <Text style={styles.personDescription}>Produto: {item.produto}</Text>
            <Text style={styles.personDescription}>Quantidade: {item.quantidade}</Text>
            <Text style={styles.personDescription}>Valor: R$ {item.valor && !isNaN(item.valor) ? item.valor.toFixed(2) : "Valor inválido"}</Text>
            <Text style={styles.personDescription}>Localização: {item.localizacao}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => handleEditVenda(item)}
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
    flex: 1,
  },
  deleteButtonHeader: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginLeft: 100,
    left: 78,
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
    paddingTop: 0,
  },
  personContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 160,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    elevation: 1,
    width: "80%",
    position: "relative",
    marginTop: 10,
    left: 65,
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
    alignItems: 'center',
  },
  editButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});
