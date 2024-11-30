import React, { useState } from 'react';
import { View,Text, TouchableOpacity, Modal, StyleSheet, TextInput, FlatList, Alert } from 'react-native';
import { IVenda } from '@/components/interface/IVenda';

export default function VendaModal() {
  const [visible, setVisible] = useState(false);
  const [nomeCliente, setNomeCliente] = useState('');
  const [produto, setProduto] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [vendas, setVendas] = useState<IVenda[]>([]);
  const [numPedido, setNumPedido] = useState(1);

  const handleAddVenda = () => {
    if (!nomeCliente || !produto || parseFloat(valorTotal) <= 0) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente.');
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
    setNomeCliente('');
    setProduto('');
    setValorTotal('');
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      
      <TouchableOpacity style={styles.openButton} onPress={() => setVisible(true)}>
        <Text style={styles.openButtonText}>+</Text>
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
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddVenda}>
                <Text style={styles.addButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setVisible(false)}>
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
            <Text>Pedido #{item.numPedido}</Text>
            <Text>Cliente: {item.nome}</Text>
            <Text>Produto: {item.produto}</Text>
            <Text>Data: {new Date(item.data).toLocaleDateString()}</Text>
            <Text>Valor: R$ {item.valor.toFixed(2)}</Text>
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
    backgroundColor: '#F5F5F5',
  },
  openButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    bottom: 5,
    left: 320,
    borderRadius: 100,
    padding: 10,
    alignItems: 'center',
  },
  openButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  vendaItem: {
    padding: 15,
    backgroundColor: '#FFF',
    marginVertical: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
});