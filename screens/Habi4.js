import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Image, TouchableOpacity, StyleSheet, Alert, Platform  } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EnviarPdf1 from './EnviarPdf1';
import ImageModal from './ImageModal';//


export default function Habi4({ showCamera, setShowCamera }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
 // const [showCamera, setShowCamera] = useState(false);
  const [photo14, setPhoto14] = useState(null);
  const [photo24, setPhoto24] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');
    const [modalVisible, setModalVisible] = useState(false);//
    const [selectedImages, setSelectedImages] = useState([]);//

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const photo14Uri = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}photo14.jpg`);
        const photo24Uri = await FileSystem.getInfoAsync(`${FileSystem.documentDirectory}photo24.jpg`);
        
        if (photo14Uri.exists) {
          const photo14Base64 = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}photo14.jpg`, { encoding: FileSystem.EncodingType.Base64 });
          setPhoto14(`data:image/jpg;base64,${photo14Base64}`);
          setCurrentPhoto(`data:image/jpg;base64,${photo14Base64}`);
        }

        if (photo24Uri.exists) {
          const photo24Base64 = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}photo24.jpg`, { encoding: FileSystem.EncodingType.Base64 });
          setPhoto24(`data:image/jpg;base64,${photo24Base64}`);
        }

      } catch (error) {
        console.error('Error reading photos:', error);
      }
    })();
  }, []);

    //
    const openModal = (images) => {
      setSelectedImages(images);
      setModalVisible(true);
    };

  const takePicture = async () => {
    if (cameraRef.current && cameraReady) {
      const photo = await cameraRef.current.takePictureAsync({ 
        base64: true,
        skipProcessing: true,
        quality: 0.10,
        width: 371,
        height: 595
       });
      return photo.base64;
    }
    return null;
  };




  const handleTakePhoto = async () => {
    if (!photo14) {
      const photoBase64 = await takePicture();
      if (photoBase64) {
        const photoUri = `${FileSystem.documentDirectory}photo14.jpg`;
        await FileSystem.writeAsStringAsync(photoUri, photoBase64, { encoding: FileSystem.EncodingType.Base64 });
        setPhoto14(`data:image/jpg;base64,${photoBase64}`);
        setCurrentPhoto(`data:image/jpg;base64,${photoBase64}`);
      }
    } else if (!photo24) {
      const photoBase64 = await takePicture();
      if (photoBase64) {
        const photoUri = `${FileSystem.documentDirectory}photo24.jpg`;
        await FileSystem.writeAsStringAsync(photoUri, photoBase64, { encoding: FileSystem.EncodingType.Base64 });
        setPhoto24(`data:image/jpg;base64,${photoBase64}`);
        setCurrentPhoto(`data:image/jpg;base64,${photoBase64}`);
      }
      setShowCamera(false);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Sin permisos para acceder a la camara</Text>;
  }






  const delante =async () => {
    await FileSystem.deleteAsync(`${FileSystem.documentDirectory}photo14.jpg`);
    setPhoto14(null);
    setCurrentPhoto(photo24 ? photo24 : null);
}


const handleDeletePhoto = async () => {
  Alert.alert(
    'Confirmar eliminación',
    '¿Estás seguro/a de que deseas eliminar este elemento?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
            await FileSystem.deleteAsync(`${FileSystem.documentDirectory}photo14.jpg`);
            setPhoto14(null);
            setCurrentPhoto(null);
            await FileSystem.deleteAsync(`${FileSystem.documentDirectory}photo24.jpg`);
            setPhoto24(null);
            setCurrentPhoto(null);
        },
      },
    ],
    { cancelable: false }
  );


};




  return (
    <View style={styles.container}>

      {showCamera ? (
        <>
         <View style={styles.ayudaContainer}>
   
   {!photo14 ? (
      <>
      <TouchableOpacity 
    onPress={() => setShowCamera(false)}  >
        <Ionicons name="chevron-back-circle-outline" size={30} color="#000000" />
      </TouchableOpacity>
      <Text style={styles.super1}>Delante</Text>
      <Text style={styles.textAyuda}>Toma la parte FRONTAL de tu documento</Text>
      </>
      ) : (
        <>
      <TouchableOpacity 
    onPress={delante}  >
        <Ionicons name="chevron-back-circle-outline" size={30} color="#000000" />
      </TouchableOpacity>
        <Text style={styles.super1}>Detrás</Text>
        <Text style={styles.textAyuda}>Y ahora la parte de ATRÁS </Text>
        </>
      )}
      </View>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          onCameraReady={() => setCameraReady(true)}
        >
        <View style={styles.rectangleN} />
         
        </CameraView>
        <View style={styles.buttonsContainer}>
      {/**   <TouchableOpacity onPress={cancelar} disabled={!picture1}>
        <Octicons name="x-circle" size={24} color="#0D7AFF"/>
        </TouchableOpacity>*/}

        <View style={styles.miniatura}>


        </View>
      <TouchableOpacity onPress={handleTakePhoto} style={styles.circleButton}>
          <View style={styles.circle} >
         
          <Ionicons name="camera-outline" size={40} color="#FFFFFF" />

          </View>
        </TouchableOpacity>
     
    </View>
        </>
      ) : (
        <View style={styles.imageContainer}>
          
          {currentPhoto ? (
            <>
             <>
             <Text style={styles.super3}>Habilitacion 4</Text>
             <Text style={styles.textAyuda2}>toca la imagen para ampliar</Text>
             </>
            <>
            <TouchableOpacity onPress={() => openModal([photo14, photo24])}>
              <Image source={{ uri: photo14 }} style={styles.image} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openModal([photo14, photo24])}>
              <Image source={{ uri: photo24 }} style={styles.image} />
            </TouchableOpacity>
            <ImageModal 
        visible={modalVisible} 
        images={selectedImages} 
        onClose={() => setModalVisible(false)} 
      />
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20,marginBottom:-70 }}>
            <Button title="Eliminar" onPress={handleDeletePhoto} />
            <EnviarPdf1
     photo1={photo14}
     photo2={photo24}
     />
            </View>
            </>
            </>
           
          ) : (
            <>
             <View style={styles.ayudaContainer2}>
             <Text style={styles.super2}>Habilitacion 4</Text>
             <Text style={styles.textAyuda2}>Busca un lugar iluminado para que la foto salga bien ✨ </Text>
             </View>
            <TouchableOpacity onPress={() => setShowCamera(true)} style={styles.agregar}>
            <View style={styles.circle} >
           
            <MaterialIcons name="add-a-photo" size={40} color="#FFFFFF" />
  
            </View>
          </TouchableOpacity>
          </>

          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:-50
  },
  agregar: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#ebf1ff",
    width: Platform.OS === 'android' ? 360: 360,
    height: Platform.OS === 'android' ? 230:230,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: "#000000",
    borderRadius: 24,

  },

  camera: {
    width: 373,
    height: 240,
    marginTop:-50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  rectangleN: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 389,
    height: 252,
    borderWidth: 8,
    borderColor: "#e9eaee",
    borderRadius: 22,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 5,
    width: '100%',
    height: '8%',
 marginTop:8,
    
  },
  miniatura: {
    width: 170,
    height: 120,
   // backgroundColor: 'black',
  },
  circleButton: {
    width: Platform.OS === 'android' ? 70 :110,
    height: Platform.OS === 'android' ? 70 :110,
    borderRadius: 60,
    backgroundColor: '#0075ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:70

  },
  circle: {
    width: Platform.OS === 'android' ? 65 :75,
    height: Platform.OS === 'android' ? 65 :75,
    borderRadius: 50,
    backgroundColor: '#0075ff',
    alignItems: 'center',
    justifyContent: 'center',
   // transform: [{ rotate: '90deg' }]
  },
  super1:{
    fontSize: 25,
    
  },
  textAyuda: {
    justifyContent: 'center',
    fontSize:16,
   color: "#424242"
  },
  super2:{
    fontSize: Platform.OS === 'android' ? 18 :25,
marginTop: Platform.OS === 'android' ? 50 :-80,
  },
  super3:{
    fontSize: Platform.OS === 'android' ? 18 :25,
marginTop: Platform.OS === 'android' ? -70 :-120,
  },
  textAyuda2: {
    justifyContent: 'center',
    fontSize:Platform.OS === 'android' ? 11 :13,
   color: "#424242",
   marginBottom: 10,
  },
  ayudaContainer:{
    marginTop:-10,
    marginBottom:60,
    width:350,
    

  },
  ayudaContainer2:{
    marginTop:-510,
    marginBottom:65,
    width:"90%",
    height:200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  image: {
    width: Platform.OS === 'android' ? 345: 393,
    height: Platform.OS === 'android' ? 504:259,
    resizeMode: Platform.OS === 'ios' ? 'contain':'auto',
    borderWidth: 8,
    borderColor: "#e9eaee",
    borderRadius: 24,
  transform: Platform.OS === 'android' ?[{ rotate: '0deg' }]:'auto',
    marginVertical:Platform.OS === 'android' ? 10 : '0',
  },
  volver: {
    padding: 5,
    marginTop:-15,
    marginBottom:30,
    marginLeft:"-85%",
  },
});

