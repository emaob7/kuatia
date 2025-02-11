import React, { useState, useRef, useEffect } from 'react';
import { View, Button, Image, Alert, Text, TouchableOpacity, ScrollView } from 'react-native';
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
    await FileSystem.deleteAsync(`${PHOTO_STORAGE_PATH}${index}.jpg`, { idempotent: true });
    const newPhotoUris = [...photoUris];
    newPhotoUris[index] = null;
    setPhotoUris(newPhotoUris);
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
      imagesHtml += `<img src="data:image/jpeg;base64,${base64Image}" style="margin:5px; width:106px; height:121px;" />`;
    }

    const htmlContent = `
      <html>
        <body style="display:flex; flex-wrap: wrap;">${imagesHtml}</body>
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
        <View style={{ position: 'relative', width: '100%', height: 350, justifyContent: 'center', alignItems: 'center', marginTop:40 }}>
          <View style={{ borderWidth: 4, borderColor: '#2196F3', borderRadius: 10, overflow: 'hidden' }}>
      <CameraView style={{ width: 300, height: 350 }} ref={cameraRef} />
    </View>
          <TouchableOpacity onPress={takePicture} style={{  bottom: -200, backgroundColor: '#2196F3', borderRadius: 50, padding: 35 }}>
            <AntDesign name="camera" size={30} color="white" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ width: '100%' }}>
          {photoUris.map((photoUri, index) => (
            <View key={index} style={{ marginBottom: 20 }}>
              {!photoUri ? (
                <TouchableOpacity
                  onPress={() => {
                    setActivePhotoIndex(index);
                    setShowCamera(true);
                  }}
                  style={{ width: '100%', height: 170, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ddd', borderRadius: 10 }}
                >
                  <AntDesign name="plus" size={50} color="black" />
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image
                    source={{ uri: photoUri }}
                    style={{ width: 150, height: 170, marginRight: 10, borderRadius: 10 }}
                  />
                  <View>
                    <Text style={{ marginBottom: 5 }}>¿Cuántas necesitas?</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                      <TouchableOpacity
                        onPress={() => {
                          const newCopies = [...copies];
                          newCopies[index] = Math.max(1, newCopies[index] - 1);
                          setCopies(newCopies);
                        }}
                        style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 5 }}
                      >
                        <Text style={{ fontSize: 18 }}>-</Text>
                      </TouchableOpacity>
                      <Text style={{ marginHorizontal: 10, fontSize: 16 }}>{copies[index]}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          const newCopies = [...copies];
                          newCopies[index] = Math.min(8, newCopies[index] + 1);
                          setCopies(newCopies);
                        }}
                        style={{ padding: 10, backgroundColor: '#ddd', borderRadius: 5 }}
                      >
                        <Text style={{ fontSize: 18 }}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Button title="Generar PDF" onPress={() => generatePDF(index)} disabled={!photoUri} />
                    {photoUri && (
                      <Button
                        title="Eliminar Foto"
                        onPress={() => deletePhoto(index)}
                        color="red"
                        style={{ marginTop: 10 }}
                      />
                    )}
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

export default Carnet;