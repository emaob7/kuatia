import React, { useState, useRef, useEffect } from 'react';
import { View, Button, Image, Alert, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { AntDesign } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const PHOTO_STORAGE_PATH = FileSystem.documentDirectory + 'photo_';

function Carnet() {
  const [photoUris, setPhotoUris] = useState(Array(4).fill(null)); // Estado para 4 fotos
  const [showCamera, setShowCamera] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(null); // Índice de la foto activa
  const [copies, setCopies] = useState(Array(4).fill(1)); // Copias para cada foto
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
    loadSavedPhotos();
  }, [permission]);

  const loadSavedPhotos = async () => {
    const savedPhotos = await Promise.all(
      Array(4).fill().map(async (_, index) => {
        const fileInfo = await FileSystem.getInfoAsync(`${PHOTO_STORAGE_PATH}${index}.jpg`);
        return fileInfo.exists ? `${PHOTO_STORAGE_PATH}${index}.jpg` : null;
      })
    );
    setPhotoUris(savedPhotos);
  };

  const takePicture = async () => {
    if (cameraRef.current && activePhotoIndex !== null) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        skipProcessing: true,
        quality: 0.10,
        exif: false,
      });
      const croppedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 300, height: 350 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      const newPhotoUri = `${PHOTO_STORAGE_PATH}${activePhotoIndex}.jpg`;
      await FileSystem.moveAsync({ from: croppedPhoto.uri, to: newPhotoUri });

      const newPhotoUris = [...photoUris];
      newPhotoUris[activePhotoIndex] = newPhotoUri;
      setPhotoUris(newPhotoUris);

      setShowCamera(false);
      setActivePhotoIndex(null);
    }
  };

  const deletePhoto = async (index) => {
    // Muestra una alerta de confirmación
    Alert.alert(
      'Eliminar foto', // Título de la alerta
      '¿Estás seguro de que quieres eliminar esta foto?', // Mensaje de la alerta
      [
        {
          text: 'Cancelar', // Botón para cancelar
          style: 'cancel', // Estilo del botón (opcional)
        },
        {
          text: 'Eliminar', // Botón para confirmar
          onPress: async () => {
            // Si el usuario confirma, elimina la foto
            await FileSystem.deleteAsync(`${PHOTO_STORAGE_PATH}${index}.jpg`, { idempotent: true });
            const newPhotoUris = [...photoUris];
            newPhotoUris[index] = null;
            setPhotoUris(newPhotoUris);
          },
          style: 'destructive', // Estilo del botón (opcional)
        },
      ],
      { cancelable: true } // Permite cerrar la alerta tocando fuera de ella (opcional)
    );
  };

  const generatePDF = async (index) => {
    const photoUri = photoUris[index];
    if (!photoUri) {
      Alert.alert('Error', 'Por favor, toma una foto primero.');
      return;
    }
    const base64Image = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    let imagesHtml = '';
for (let i = 0; i < copies[index]; i++) {
  imagesHtml += `<img src="data:image/jpeg;base64,${base64Image}" style="width: 106px; height: 121px;" />`; // Sin margen
}

const htmlContent = `
  <html>
    <body style="display: grid; grid-template-columns: repeat(6, 106px); gap: 2px; margin: 0; padding: 20px;">
      ${imagesHtml}
    </body>
  </html>
`;

    const pdfOptions = {
      html: htmlContent,
      fileName: `photo_id_${index}`,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(pdfOptions);
    sharePDF(file.filePath);
  };

  const sharePDF = async (pdfPath) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfPath);
    } else {
      Alert.alert('Error', 'No se puede compartir el archivo en este dispositivo.');
    }
  };

  const shareJPG = async (index) => {
    const photoUri = photoUris[index];
    if (!photoUri) {
      Alert.alert('Error', 'No hay una foto para compartir.');
      return;
    }
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(photoUri);
    } else {
      Alert.alert('Error', 'No se puede compartir la imagen en este dispositivo.');
    }
  };

  if (!permission || !permission.granted) {
    return (
      <View>
        <Text>Sin acceso a la cámara</Text>
        <Button title="Permitir acceso" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20 }}>
      
      {showCamera ? (
        <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
           <Text style={styles.subtitle}>
              📸Busca una pared o fondo blanco para tu foto, asegurate de que sea en un lugar iluminado.   
            </Text>
          {/* Contenedor con borde y esquinas redondeadas */}
          <View style={{ borderWidth: 4, borderColor: '#0075ff', borderRadius: 10, overflow: 'hidden' }}>
            <CameraView style={{ width: 300, height: 350 }} ref={cameraRef} />
          </View>
          {/* Botón para tomar la foto */}
          <TouchableOpacity
            onPress={takePicture}
            style={{
              marginTop: 120,
              backgroundColor: '#0075ff',
              borderRadius: 90,
              padding: 35,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AntDesign name="camera" size={50} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ width: '100%' }}>
          {photoUris.map((photoUri, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              {!photoUri ? (
                <TouchableOpacity
                  onPress={() => {
                    setActivePhotoIndex(index);
                    setShowCamera(true);
                  }}
                  style={{ width: '100%', height: 170, justifyContent: 'center', alignItems: 'center', borderWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: "#0075ff",
                    backgroundColor:"#ffffff", borderRadius: 10 }}
                >
                  <Text style={{ marginBottom: 10 }}>Toma una foto tipo carnet</Text>
                  <AntDesign name="plus" size={50} color="#0075ff" />
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor:"#ddd",borderBottomWidth:1,padding:12, backgroundColor:"white",borderRadius:10 }}>
                  <Image
                    source={{ uri: photoUri }}
                    style={{ width: 150, height: 170, marginRight: 10, borderRadius: 10 }}
                  />
                  <View>
                    <Text style={{ marginBottom: 10, marginLeft:10 }}>¿Cuántas necesitas?</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft:10 }}>
                      <TouchableOpacity
                        onPress={() => {
                          const newCopies = [...copies];
                          newCopies[index] = Math.max(1, newCopies[index] - 1);
                          setCopies(newCopies);
                        }}
                        style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 50, marginRight: 10 }}
                      >
                        <AntDesign name="minus" size={20} color="black" />
                      </TouchableOpacity>
                      <Text style={{ marginHorizontal: 10, fontSize: 16 }}>{copies[index]}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          const newCopies = [...copies];
                          newCopies[index] = Math.min(6, newCopies[index] + 1);
                          setCopies(newCopies);
                        }}
                        style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 50 }}
                      >
                        <AntDesign name="plus" size={20} color="black" />
                      </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop:25 }}>
  
    {/* Botón para eliminar foto */}
    <TouchableOpacity
    onPress={() => deletePhoto(index)}
    style={{ 
     // backgroundColor: '#F44336', 
      borderRadius: 50, 
      padding: 12, 
      alignItems: 'center', 
      marginHorizontal: 8 
    }}
  >
    <AntDesign name="delete" size={24} color='#0075ff' />
  </TouchableOpacity>
   {/* Botón para compartir JPG */}
   <TouchableOpacity
    onPress={() => shareJPG(index)}
    style={{ 
    //  backgroundColor: '#4CAF50', 
      borderRadius: 50, 
      padding: 12, 
      alignItems: 'center', 
      marginHorizontal: 8 
    }}
  >
    <AntDesign name="jpgfile1" size={24} color='#0075ff' />
  </TouchableOpacity>
  {/* Botón para generar PDF */}
  <TouchableOpacity
    onPress={() => generatePDF(index)}
    style={{ 
      backgroundColor: '#0075ff', 
      borderRadius: 50, 
      padding: 12, 
      alignItems: 'center', 
      marginHorizontal: 8 // Espaciado horizontal entre los botones
    }}
  >
    <AntDesign name="pdffile1" size={24} color="white" />
  </TouchableOpacity>

 


</View>

                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: '#555',
    marginTop: 5,
    marginBottom: 15,
  }
  })

export default Carnet;