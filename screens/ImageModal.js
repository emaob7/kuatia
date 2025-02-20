import { Modal, View, ScrollView, Image, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener instalada la librería @expo/vector-icons

const { width, height } = Dimensions.get('window');

const ImageModal = ({ visible, images, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={24} color="white" />
        </TouchableOpacity>
        <ScrollView>
          {images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.modalImage} />
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingTop: 90,
  },
  modalImage: {
    width: Platform.OS === 'android' ? 345 : 545,
    height: Platform.OS === 'android' ? 504 : 752,
    resizeMode: 'contain',
    transform: [{ rotate: '90deg' }],
    margin: -100,
  },
  closeButton: {
    position: 'absolute',
    top: 40, // Ajusta la distancia desde la parte superior
    right: 20, // Ajusta la distancia desde la derecha
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Asegura que el botón esté por encima de las imágenes
  },
});

export default ImageModal;
