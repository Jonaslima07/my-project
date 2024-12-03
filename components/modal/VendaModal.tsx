import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
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

  const handleAddVenda = () => {
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
    };

    setVendas((prevVendas) => [...prevVendas, novaVenda]);
    setNumPedido((prevNum) => prevNum + 1);
    setNomeCliente("");
    setProduto("");
    setValorTotal("");
    setVisible(false);
  };

  const handleUpdateVenda = () => {
    if (!nomeCliente || !produto || parseFloat(valorTotal) <= 0) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }

    const updatedVenda: IVenda = {
      ...editVenda!,
      nome: nomeCliente,
      produto,
      valor: parseFloat(valorTotal),
    };

    setVendas((prevVendas) =>
      prevVendas.map((venda) =>
        venda.numPedido === updatedVenda.numPedido ? updatedVenda : venda
      )
    );
    setEditMode(false);
    setEditVenda(null);
    setNomeCliente("");
    setProduto("");
    setValorTotal("");
    setVisible(false);
  };

  const handleDeleteVenda = (numPedido: number) => {
    Alert.alert(
      "Excluir Venda",
      "Você tem certeza que deseja excluir esta venda?",
      [
        { text: "Não" },
        {
          text: "Sim",
          onPress: () => {
            setVendas((prevVendas) =>
              prevVendas.filter((venda) => venda.numPedido !== numPedido)
            );
          },
        },
      ]
    );
  };

  const handleEditVenda = (venda: IVenda) => {
    setEditMode(true);
    setEditVenda(venda);
    setNomeCliente(venda.nome);
    setProduto(venda.produto);
    setValorTotal(venda.valor.toString());
    setVisible(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.openButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.openButtonText}>+</Text>
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
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={editMode ? handleUpdateVenda : handleAddVenda}
              >
                <Text style={styles.addButtonText}>
                  {editMode ? "Atualizar" : "Salvar"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <FlatList
        data={vendas}
        keyExtractor={(item) => item.numPedido.toString()}
        renderItem={({ item }) => (
          <View style={styles.vendaItem}>
            <Text style={styles.vendaText}>Pedido #{item.numPedido}</Text>
            <Text style={styles.vendaText}>Cliente: {item.nome}</Text>
            <Text style={styles.vendaText}>Produto: {item.produto}</Text>
            <Text style={styles.vendaText}>
              Data: {new Date(item.data).toLocaleDateString()}
            </Text>
            <Text style={styles.vendaText}>
              Valor: R$ {item.valor.toFixed(2)}
            </Text>
            <View style={styles.vendaActions}>
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
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  openButton: {
    backgroundColor: "#4CAF50",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  openButtonText: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    height: 45,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#333",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  addButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  addButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#F44336",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  vendaItem: {
    padding: 15,
    backgroundColor: "#FFF",
    marginVertical: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  vendaText: {
    fontSize: 16,
    color: "#333",
  },
  vendaActions: {
    flexDirection: "row",
    justifyContent: "center", 
    alignItems: "center",          
    marginTop: 10,
    left: 100
  },
  editButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    marginRight: 15, 
    left: 5,
  },
  deleteButton: {
    
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    marginLeft: 5, 
  },
  editButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});
