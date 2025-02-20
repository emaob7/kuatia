import React, { useState, useRef, useEffect } from 'react';
import { View, Button, Image, Alert, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput,  KeyboardAvoidingView,
    Platform,
    Keyboard, } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { AntDesign } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const PHOTO_STORAGE_PATH = FileSystem.documentDirectory + 'document_';

function DocumentScreen() {
  const [photoUris, setPhotoUris] = useState(Array(4).fill({ front: null, back: null, nombre: "", cin: "" })); // Estado para 4 documentos (frente, dorso, nombre y CIN)
  const [showCamera, setShowCamera] = useState(false);
  const [activeDocumentIndex, setActiveDocumentIndex] = useState(null); // Índice del documento activo
  const [activePhotoSide, setActivePhotoSide] = useState(null); // 'front' o 'back'
  const cameraRef = useRef(null);
  const [permission, requestPermission] = useCameraPermissions();
  const scrollViewRef = useRef(null); // Referencia para el ScrollView

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
    loadSavedDocuments();
  }, [permission]);

  // Cargar documentos guardados
  const loadSavedDocuments = async () => {
    const savedDocuments = await Promise.all(
      Array(4).fill().map(async (_, index) => {
        const frontFileInfo = await FileSystem.getInfoAsync(`${PHOTO_STORAGE_PATH}${index}_front.jpg`);
        const backFileInfo = await FileSystem.getInfoAsync(`${PHOTO_STORAGE_PATH}${index}_back.jpg`);
        const dataFileInfo = await FileSystem.getInfoAsync(`${PHOTO_STORAGE_PATH}${index}_data.json`);
        let data = { nombre: "", cin: "" };
        if (dataFileInfo.exists) {
          const dataContent = await FileSystem.readAsStringAsync(`${PHOTO_STORAGE_PATH}${index}_data.json`);
          data = JSON.parse(dataContent);
        }
        return {
          front: frontFileInfo.exists ? `${PHOTO_STORAGE_PATH}${index}_front.jpg` : null,
          back: backFileInfo.exists ? `${PHOTO_STORAGE_PATH}${index}_back.jpg` : null,
          nombre: data.nombre,
          cin: data.cin,
        };
      })
    );
    setPhotoUris(savedDocuments);
  };

  // Guardar datos (nombre y CIN) para un documento específico
  const saveData = async (index) => {
    const nombre = photoUris[index].nombre;
    const cin = photoUris[index].cin;

    if (!nombre || !cin) {
      Alert.alert('Error', 'Por favor, ingresa el nombre y el CIN.');
      return;
    }

    const data = { nombre, cin };
    await FileSystem.writeAsStringAsync(`${PHOTO_STORAGE_PATH}${index}_data.json`, JSON.stringify(data));

    Alert.alert('Datos guardados', 'Los datos se han guardado correctamente.');
  };

  // Actualizar nombre o CIN para un documento específico
  const updateDocumentData = (index, field, value) => {
    const newPhotoUris = [...photoUris];
    newPhotoUris[index][field] = value;
    setPhotoUris(newPhotoUris);
  };

  // Tomar foto
  const takePicture = async () => {
    if (cameraRef.current && activeDocumentIndex !== null && activePhotoSide !== null) {
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        skipProcessing: true,
        quality: 0.10,
        exif: false,
      });
      const croppedPhoto = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 360, height: 230 } }],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
      );
      const newPhotoUri = `${PHOTO_STORAGE_PATH}${activeDocumentIndex}_${activePhotoSide}.jpg`;
      await FileSystem.moveAsync({ from: croppedPhoto.uri, to: newPhotoUri });

      const newPhotoUris = [...photoUris];
      newPhotoUris[activeDocumentIndex][activePhotoSide] = newPhotoUri;
      setPhotoUris(newPhotoUris);

      // Si se tomó la foto frontal, preparar para tomar la foto del dorso
      if (activePhotoSide === 'front') {
        setActivePhotoSide('back');
       // Alert.alert('Foto frontal tomada', 'Ahora toma la foto del dorso.');
      } else {
        // Si se tomó la foto del dorso, cerrar la cámara
        setShowCamera(false);
        setActiveDocumentIndex(null);
        setActivePhotoSide(null);
      }
    }
  };

  // Eliminar documento
  const deleteDocument = async (index) => {
    Alert.alert(
      'Eliminar documento',
      '¿Estás seguro de que quieres eliminar este documento?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: async () => {
            await FileSystem.deleteAsync(`${PHOTO_STORAGE_PATH}${index}_front.jpg`, { idempotent: true });
            await FileSystem.deleteAsync(`${PHOTO_STORAGE_PATH}${index}_back.jpg`, { idempotent: true });
            await FileSystem.deleteAsync(`${PHOTO_STORAGE_PATH}${index}_data.json`, { idempotent: true });
            const newPhotoUris = [...photoUris];
            newPhotoUris[index] = { front: null, back: null, nombre: "", cin: "" };
            setPhotoUris(newPhotoUris);
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // Generar PDF
  const generatePDF = async (index) => {
    const frontPhotoUri = photoUris[index].front;
    const backPhotoUri = photoUris[index].back;
    if (!frontPhotoUri || !backPhotoUri) {
      Alert.alert('Error', 'Por favor, toma ambas fotos (frente y dorso) primero.');
      return;
    }

    const frontBase64 = await FileSystem.readAsStringAsync(frontPhotoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const backBase64 = await FileSystem.readAsStringAsync(backPhotoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const dcin = photoUris[index].cin.length > 0 ? `<span>, con CIN: ${photoUris[index].cin}</span>` : '';
    const dnombre = photoUris[index].nombre.length > 0 ? `<span>Fotocopia de cédula de ${photoUris[index].nombre}</span>` : '';

    const htmlContent = `
      <html>
      <head>
        <style>
          .container {
            text-align: center;
            padding: 20px;
          }
          .title {
            font-size: 18px;
            margin-bottom: 20px;
          }
          .image-container {
            display: flex;
            justify-content: center;
            gap: 30px;
            padding: 10px 50px 20px;
            margin-top: -20px;
          }
          .image-wrapper {
            width: auto;
          }
          .imagen {
            border-radius: 10px;
            width: 300px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="title">
            ${dnombre} ${dcin}
          </div>
          <div class="image-container">
            <div class="image-wrapper">
              <img class="imagen" src="data:image/jpeg;base64,${frontBase64}" alt="Licencia 1">
            </div>
            <div class="image-wrapper">
              <img class="imagen" src="data:image/jpeg;base64,${backBase64}" alt="Licencia 2">
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const pdfOptions = {
      html: htmlContent,
      fileName: `document_${index}`,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(pdfOptions);
    sharePDF(file.filePath);
  };

  // Compartir PDF
  const sharePDF = async (pdfPath) => {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfPath);
    } else {
      Alert.alert('Error', 'No se puede compartir el archivo en este dispositivo.');
    }
  };

  // Compartir JPG
  const shareJPG = async (index, side) => {
    const photoUri = photoUris[index][side];
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
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10, paddingTop:10 }}
      keyboardShouldPersistTaps="handled"
    >
      {showCamera ? (
        <View style={{ width: '100%', alignItems: 'center', marginTop: 40 }}>
             <View>
      <Text style={styles.title}>
        {activePhotoSide === 'front' ? 'Frontal 🪪' : 'Dorso 💳'}
      </Text>
      <Text style={styles.subtitle}>
        {activePhotoSide === 'front' 
          ? 'Limpia tu cámara y ponte en un lugar con buena luz.'
          : 'Asegúrate de que la imagen sea clara y legible.'}
      </Text>
    </View>
          <View style={{ borderWidth: 4, borderColor: '#2196F3', borderRadius: 10, overflow: 'hidden' }}>
            <CameraView style={{ width: 360, height: 230 }} ref={cameraRef} />
          </View>
          <TouchableOpacity
            onPress={takePicture}
            style={{
              marginTop: 220,
              backgroundColor: '#2196F3',
              borderRadius: 100,
              padding: 45,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <AntDesign name="camera" size={50} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ width: '100%' }}>
          {photoUris.map((document, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              {!document.front || !document.back ? (
                <TouchableOpacity
                  onPress={() => {
                    setActiveDocumentIndex(index);
                    setActivePhotoSide('front');
                    setShowCamera(true);
                  }}
                  style={{ width: '100%', height: 170, justifyContent: 'center', alignItems: 'center', borderWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: "#0075ff",
                    backgroundColor:"#ffffff", borderRadius: 10 }}
                >
                  <Text style={{ marginBottom: 10 }}>{!document.front ? 'Tomar una foto de cedula' : 'Tomar foto del dorso'}</Text>
                  <AntDesign name="plus" size={50} color="#0075ff" />
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor:"#ddd",borderBottomWidth:1,padding:12, backgroundColor:"white",borderRadius:10 }}>
                  
                  <View style={{ flexDirection: 'column', alignItems: 'left' }}>
                    <Image
                      source={{ uri: document.front }}
                      style={{ width: 140, height: 90, marginRight: 10, marginBottom: 5, borderRadius: 10 }}
                    />
                    <Image
                      source={{ uri: document.back }}
                      style={{ width: 140, height: 90, marginRight: 10, borderRadius: 10 }}
                    />
                  </View>
                  <View>
                  <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        value={document.nombre}
                        onChangeText={(text) => updateDocumentData(index, 'nombre', text)}
                        onFocus={() => {
                            // Desplazar el ScrollView solo cuando el input está enfocado
                            setTimeout(() => {
                              scrollViewRef.current.scrollTo({ y: index * 300, animated: true });
                            }, 100);
                          }}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="CIN"
                        value={document.cin}
                        onChangeText={(text) => updateDocumentData(index, 'cin', text)}
                        onFocus={() => {
                            // Desplazar el ScrollView solo cuando el input está enfocado
                            setTimeout(() => {
                              scrollViewRef.current.scrollTo({ y: index * 300, animated: true });
                            }, 100);
                          }}
                      />
                    <TouchableOpacity
                      onPress={() => saveData(index)}
                      style={styles.saveButton}
                    >
                      <Text style={styles.saveButtonText}>Guardar</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.textAyuda}>Guarda Nombre, CIN si quieres que aparezca en el PDF</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, marginLeft: 10 }}>
                      <TouchableOpacity
                        onPress={() => deleteDocument(index)}
                        style={{ padding: 10, borderRadius: 50, marginHorizontal: 13  }}
                      >
                        <AntDesign name="delete" size={20} color='#0075ff' />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => shareJPG(index, 'front')}
                        style={{ padding: 10, borderRadius: 50, marginHorizontal: 13  }}
                      >
                        <AntDesign name="jpgfile1" size={20} color='#0075ff' />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => generatePDF(index)}
                        style={{ padding: 10, backgroundColor: '#0075ff', borderRadius: 50, marginHorizontal: 13  }}
                      >
                        <AntDesign name="pdffile1" size={20} color="white" />
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
     </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 35,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: 220,
  },
  saveButton: {
    backgroundColor: '#0075ff',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 3,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  textAyuda: {
    color: 'gray',
    fontSize: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
    color: '#555',
    marginTop: 5,
    marginBottom: 15,
  },
});

export default DocumentScreen;