
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, FlatList, Alert } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IVenda } from "@/components/interface/IVenda";

export default function VendaModal() {
  const [visible, setVisible] = useState(false);
  const [nomeCliente, setNomeCliente] = useState("");
  const [produto, setProduto] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [vendas, setVendas] = useState<IVenda[]>([]);
  const [numPedido, setNumPedido] = useState(1);
  const [editMode, setEditMode] = useState(false);
  const [editVenda, setEditVenda] = useState<IVenda | null>(null);
  const [localizacao, setLocalizacao] = useState<string>("");

  useEffect(() => {
    loadVendas();
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão negada",
          "Não foi possível acessar sua localização."
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLocalizacao(`Latitude: ${latitude}, Longitude: ${longitude}`);
    } catch (error) {
      Alert.alert("Erro", "Não foi possível obter sua localização.");
    }
  };

  const loadVendas = async () => {
    try {
      const savedVendas = await AsyncStorage.getItem("vendas");
      if (savedVendas) {
        const vendasParsed: IVenda[] = JSON.parse(savedVendas);
        setVendas(vendasParsed);
        const maxNumPedido = Math.max(
          ...vendasParsed.map((venda) => venda.numPedido),
          0
        );
        setNumPedido(maxNumPedido + 1);
      }
    } catch (error) {
      console.log("Erro ao carregar vendas:", error);
    }
  };

  const saveVendas = async (vendas: IVenda[]) => {
    try {
      await AsyncStorage.setItem("vendas", JSON.stringify(vendas));
    } catch (error) {
      console.log("Erro ao salvar vendas:", error);
    }
  };

  const handleAddVenda = async () => {
    if (!nomeCliente || !produto || parseFloat(valorTotal) <= 0) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }

    const novaVenda: IVenda = {
      numPedido,
      nome: nomeCliente,
      produto,
      data: new Date(),
      valor: parseFloat(valorTotal),
      localizacao,
    };

    const novasVendas = [...vendas, novaVenda];
    setVendas(novasVendas);
    setNumPedido(numPedido + 1);
    saveVendas(novasVendas);

    setNomeCliente("");
    setProduto("");
    setValorTotal("");
    setVisible(false);
  };

  const handleDeleteVenda = (numPedido: number) => {
    const novasVendas = vendas.filter((venda) => venda.numPedido !== numPedido);

    setVendas(novasVendas);
    saveVendas(novasVendas);
    resetForm();
  };

  const resetForm = () => {
    setNomeCliente("");
    setProduto("");
    setValorTotal("");
    setEditMode(false);
    setEditVenda(null);
    setVisible(false);
  };

  const handleEditVenda = (venda: IVenda) => {
    setEditMode(true);
    setEditVenda(venda);
    setNomeCliente(venda.nome);
    setProduto(venda.produto);
    setValorTotal(venda.valor.toString());
    setVisible(true);
  };

  const handleUpdateVenda = async () => {
    if (!editVenda) return;

    const updatedVenda: IVenda = {
      ...editVenda,
      nome: nomeCliente,
      produto,
      valor: parseFloat(valorTotal),
    };

    const novasVendas = vendas.map((venda) =>
      venda.numPedido === editVenda.numPedido ? updatedVenda : venda
    );

    setVendas(novasVendas);
    saveVendas(novasVendas);

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
              {editMode ? "Editar Venda" : "Nova Venda"}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nome do Cliente"
              value={nomeCliente}
              onChangeText={setNomeCliente}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Produto"
              value={produto}
              onChangeText={setProduto}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Valor Total"
              value={valorTotal}
              onChangeText={setValorTotal}
              keyboardType="numeric"
            />

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.saveButtonModal}
                onPress={editMode ? handleUpdateVenda : handleAddVenda}
              >
                <Text style={styles.addButtonText}>
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
        data={vendas}
        keyExtractor={(item) => item.numPedido.toString()}
        renderItem={({ item }) => (
          <View style={styles.personContainer}>
            <Text style={styles.personDescription}>
              Pedido #{item.numPedido}
            </Text>
            <Text style={styles.personDescription}>Cliente: {item.nome}</Text>
            <Text style={styles.personDescription}>
              Produto: {item.produto}
            </Text>
            <Text style={styles.personDescription}>
              Data: {new Date(item.data).toLocaleDateString()}
            </Text>
            <Text style={styles.personDescription}>
              Valor: R$ {item.valor.toFixed(2)}
            </Text>
            <Text style={styles.personDescription}>{item.localizacao}</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => handleEditVenda(item)}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteVenda(item.numPedido)}
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
    paddingTop: 15,
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
    fontSize: 25,
    fontWeight: "bold",
  },
  saveButtonModal: {
    backgroundColor: "#2196F3",
    padding: 5,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  cardContainer: {
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 555,
  },
  personContainer: {
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    elevation: 1,
    width: "80%",
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
