import { Modal, View, ScrollView, Image, Button, StyleSheet, Dimensions,Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const ImageModal = ({ visible, images, onClose }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <ScrollView>
          {images.map((img, index) => (
            <Image key={index} source={{ uri: img }} style={styles.modalImage} />
          ))}
        </ScrollView>
        <View style={styles.closeButtonContainer}>
          <Button title="Cerrar" onPress={onClose} />
        </View>
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
    paddingTop:30
  },
  modalImage: {
    width: Platform.OS === 'android' ? 345: 545,
    height: Platform.OS === 'android' ? 504:752,
    resizeMode: 'contain',
    transform: [{ rotate: '90deg' }],
    margin:-100,
    
  },
  closeButtonContainer: {
    position: 'absolute',
    bottom: 30, // Ajusta este valor para subir más el botón
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 10,
  },
});

export default ImageModal;
