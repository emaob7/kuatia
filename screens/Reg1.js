import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EnviarPdf1 from './EnviarPdf1';


export default function Reg1({ showCamera, setShowCamera }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
 // const [showCamera, setShowCamera] = useState(false);
  const [photo3, setPhoto3] = useState(null);
  const [photo4, setPhoto4] = useState(null);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const cameraRef = useRef(null);
  const [facing, setFacing] = useState('back');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const photo3Uri = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'photo3.jpg');
        const photo4Uri = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'photo4.jpg');
        
        if (photo3Uri.exists) {
          const photo3Base64 = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'photo3.jpg', { encoding: FileSystem.EncodingType.Base64 });
          setPhoto3(`data:image/jpg;base64,${photo3Base64}`);
          setCurrentPhoto(`data:image/jpg;base64,${photo3Base64}`);
        }

        if (photo4Uri.exists) {
          const photo4Base64 = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'photo4.jpg', { encoding: FileSystem.EncodingType.Base64 });
          setPhoto4(`data:image/jpg;base64,${photo4Base64}`);
        }

      } catch (error) {
        console.error('Error reading photos:', error);
      }
    })();
  }, []);

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
    if (!photo3) {
      const photoBase64 = await takePicture();
      if (photoBase64) {
        const photoUri = `${FileSystem.documentDirectory}photo3.jpg`;
        await FileSystem.writeAsStringAsync(photoUri, photoBase64, { encoding: FileSystem.EncodingType.Base64 });
        setPhoto3(`data:image/jpg;base64,${photoBase64}`);
        setCurrentPhoto(`data:image/jpg;base64,${photoBase64}`);
      }
    } else if (!photo4) {
      const photoBase64 = await takePicture();
      if (photoBase64) {
        const photoUri = `${FileSystem.documentDirectory}photo4.jpg`;
        await FileSystem.writeAsStringAsync(photoUri, photoBase64, { encoding: FileSystem.EncodingType.Base64 });
        setPhoto4(`data:image/jpg;base64,${photoBase64}`);
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
    await FileSystem.deleteAsync(FileSystem.documentDirectory + 'photo3.jpg');
    setPhoto3(null);
    setCurrentPhoto(photo4 ? photo4 : null);
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
            await FileSystem.deleteAsync(FileSystem.documentDirectory + 'photo3.jpg');
            setPhoto3(null);
            setCurrentPhoto(null);
            await FileSystem.deleteAsync(FileSystem.documentDirectory + 'photo4.jpg');
            setPhoto4(null);
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
   
   {!photo3 ? (
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
             <Text style={styles.super2}>Licencia 1</Text>
             <Text style={styles.textAyuda2}>toca la imagen para ver el dorso 🔄 </Text>
             </>
            <>
             <TouchableOpacity onPress={() => setCurrentPhoto(currentPhoto === photo3 ? photo4 : photo3)}>
              <Image source={{ uri: currentPhoto }} style={styles.image} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10,marginBottom:-10 }}>
            <Button title="Eliminar" onPress={handleDeletePhoto} />
            <EnviarPdf1
     photo1={photo3}
     photo2={photo4}
     />
            </View>
            </>
            </>
           
          ) : (
            <>
             <View style={styles.ayudaContainer2}>
             <Text style={styles.super2}>Licencia 1</Text>
             <Text style={styles.textAyuda2}>Busca un lugar iluminado para que la foto salga bien ✨ </Text>
             </View>
            <>
            <TouchableOpacity onPress={() => setShowCamera(true)} style={styles.agregar}>
            <View style={styles.circle} >
           
            <MaterialIcons name="add-a-photo" size={40} color="#FFFFFF" />
  
            </View>
          </TouchableOpacity>
          </>
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
  },
  agregar: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 375,
    height: 574,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: "#000000",
    borderRadius: 24,
    backgroundColor:"#ebf1ff",
  },

  camera: {
    width: 351,
    height: 550,
    marginTop:-50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
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
    width: 365,
    height: 564,
    borderWidth: 8,
    borderColor: "#e9eaee",
    borderRadius: 24,
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
    width: 110,
    height: 110,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1462fc',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }]
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
    fontSize: 25,
marginTop:-30,
  },
  textAyuda2: {
    justifyContent: 'center',
    fontSize:16,
   color: "#424242",
   marginBottom: 12
  },
  ayudaContainer:{
    marginTop:-10,
    marginBottom:60,
    width:350,
  },
  ayudaContainer2:{
    marginTop:-550,
    marginBottom:65,
    width:"90%",
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    

  },
  image: {
     width: 395,
    height: 594,
    resizeMode: 'contain',
    borderWidth: 8,
    borderColor: "#e9eaee",
    borderRadius: 24,
  },
  volver: {
    padding: 5,
    marginTop:-15,
    marginBottom:30,
    marginLeft:"-85%",
  },
});