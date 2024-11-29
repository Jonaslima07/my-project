import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import { IProdutos } from "@/components/interface/IProdutos";

export default function ProdutoModal() {
  const [visible, setVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [marca, setMarca] = useState("");
  const [preco, setPreco] = useState(0);
  const [descricao, setDescricao] = useState("");


  const [produtos, setProdutos] = useState<IProdutos[]>([]);

  const handleAdd = () => {
    if (nome.trim() === "" || descricao.trim() === "") {
      Alert.alert("Preencha todos os campos para prosseguir!");
      return;
    }

    const novoProduto: IProdutos = {
      nome,
      descricao,
      marca,
      preco,
      
    };

    setProdutos([...produtos, novoProduto]);
    setNome("");
    setDescricao("");
    setVisible(false);
  };

  const handleCancel = () => {
    setNome("");
    setDescricao("");
    setVisible(false);
  };
  

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
            <Text style={styles.modalTitle}>Adicionar Produto</Text>

            <TextInput
              style={styles.textInput}
              placeholder="Nome do Produto"
              value={nome}
              onChangeText={(text) => setNome(text)}
              autoFocus
            />

            <TextInput
              style={styles.textInput}
              placeholder="Descrição"
              value={descricao}
              onChangeText={(text) => setDescricao(text)}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Marca"
              value={marca}
              onChangeText={(text) => setMarca(text)}
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
            

           

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.addButtonModal}
                onPress={handleAdd}
              >
                <Text style={styles.buttonText}>Adicionar</Text>
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
        keyExtractor={(item, index) => index.toString()} // A chave para o item
        renderItem={({ item }) => (
          <View style={styles.personContainer}>
            <Text style={styles.personName}>{item.nome}</Text>
            <Text style={styles.personDescription}>{item.descricao}</Text>
            <Text style={styles.personDescription}>Marca: {item.marca}</Text>
            <Text style={styles.personDescription}>Preço: R${item.preco}</Text>
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
    fontSize: 28,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
  },
  textInput: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  addButtonModal: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonModal: {
    backgroundColor: "#f44336",
    padding: 10,
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
});
