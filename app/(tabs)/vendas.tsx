import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, FlatList, Alert } from "react-native";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { IVenda } from "@/components/interface/IVenda";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function VendasList() {
  const [visible, setVisible] = useState(false);
  const [nomeCliente, setNomeCliente] = useState("");
  const [produto, setProduto] = useState("");
  const [valorTotal, setValorTotal] = useState("");
  const [vendas, setVendas] = useState<IVenda[]>([]);
  const [numPedido, setNumPedido] = useState(1);
  const [localizacao, setLocalizacao] = useState<string>("");

  useEffect(() => {
    loadVendas();
  }, []);

  useEffect(() => {
    if (visible) {
      requestLocation();
    }
  }, [visible]);

  const requestLocation = async () => {
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

  return (
    <View style={styles.container}>
      <Header />
      <TouchableOpacity style={styles.addButton} onPress={() => setVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nova Venda</Text>
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
              <TouchableOpacity style={styles.saveButtonModal} onPress={handleAddVenda}>
                <Text style={styles.addButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButtonModal} onPress={() => setVisible(false)}>
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
            <Text style={styles.personDescription}>Pedido #{item.numPedido}</Text>
            <Text style={styles.personDescription}>Cliente: {item.nome}</Text>
            <Text style={styles.personDescription}>Produto: {item.produto}</Text>
            <Text style={styles.personDescription}>Data: {new Date(item.data).toLocaleDateString()}</Text>
            <Text style={styles.personDescription}>Valor: R$ {item.valor.toFixed(2)}</Text>
            <Text style={styles.personDescription}>{item.localizacao}</Text>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cardContainer}
      />
      <Footer />
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
    marginBottom: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    elevation: 1,
    width: 300,
    position: "fixed",
    marginTop: 0,
  },
  personDescription: {
    fontSize: 14,
    color: "#555",
  },
});
