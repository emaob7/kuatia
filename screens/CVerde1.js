import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Image, TouchableOpacity, StyleSheet, Alert, Platform  } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EnviarPdf1 from './EnviarPdf1';


export default function CVerde1({ showCamera, setShowCamera }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
 // const [showCamera, setShowCamera] = useState(false);
  const [photo7, setPhoto7] = useState(null);
  const [photo8, setPhoto8] = useState(null);
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
        const photo7Uri = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'photo7.jpg');
        const photo8Uri = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'photo8.jpg');
        
        if (photo7Uri.exists) {
          const photo7Base64 = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'photo7.jpg', { encoding: FileSystem.EncodingType.Base64 });
          setPhoto7(`data:image/jpg;base64,${photo7Base64}`);
          setCurrentPhoto(`data:image/jpg;base64,${photo7Base64}`);
        }

        if (photo8Uri.exists) {
          const photo8Base64 = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'photo8.jpg', { encoding: FileSystem.EncodingType.Base64 });
          setPhoto8(`data:image/jpg;base64,${photo8Base64}`);
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
    if (!photo7) {
      const photoBase64 = await takePicture();
      if (photoBase64) {
        const photoUri = `${FileSystem.documentDirectory}photo7.jpg`;
        await FileSystem.writeAsStringAsync(photoUri, photoBase64, { encoding: FileSystem.EncodingType.Base64 });
        setPhoto7(`data:image/jpg;base64,${photoBase64}`);
        setCurrentPhoto(`data:image/jpg;base64,${photoBase64}`);
      }
    } else if (!photo8) {
      const photoBase64 = await takePicture();
      if (photoBase64) {
        const photoUri = `${FileSystem.documentDirectory}photo8.jpg`;
        await FileSystem.writeAsStringAsync(photoUri, photoBase64, { encoding: FileSystem.EncodingType.Base64 });
        setPhoto8(`data:image/jpg;base64,${photoBase64}`);
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
    await FileSystem.deleteAsync(FileSystem.documentDirectory + 'photo7.jpg');
    setPhoto7(null);
    setCurrentPhoto(photo8 ? photo8 : null);
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
            await FileSystem.deleteAsync(FileSystem.documentDirectory + 'photo7.jpg');
            setPhoto7(null);
            setCurrentPhoto(null);
            await FileSystem.deleteAsync(FileSystem.documentDirectory + 'photo8.jpg');
            setPhoto8(null);
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
   
   {!photo7 ? (
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
             <Text style={styles.super3}>Cedula Verde 1</Text>
             <Text style={styles.textAyuda2}>toca la imagen para ver el dorso 🔄 </Text>
             </>
            <>
             <TouchableOpacity onPress={() => setCurrentPhoto(currentPhoto === photo7 ? photo8 : photo7)}>
              <Image source={{ uri: currentPhoto }} style={styles.image} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10,marginBottom:-70 }}>
            <Button title="Eliminar" onPress={handleDeletePhoto} />
            <EnviarPdf1
     photo1={photo7}
     photo2={photo8}
     />
            </View>
            </>
            </>
           
          ) : (
            <>
             <View style={styles.ayudaContainer2}>
             <Text style={styles.super2}>Cedula Verde 1</Text>
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
    marginTop:-50
  },
  agregar: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:"#ebf1ff",
    width: Platform.OS === 'android' ? 345: 380,
    height: Platform.OS === 'android' ? 504:592,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: "#000000",
    borderRadius: 24,

  },

  camera: {
    width: 349,
    height: 552,
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
    width: Platform.OS === 'android' ? 70 :110,
    height: Platform.OS === 'android' ? 70 :110,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: Platform.OS === 'android' ? 65 :100,
    height: Platform.OS === 'android' ? 65 :100,
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
    fontSize: Platform.OS === 'android' ? 18 :25,
marginTop: Platform.OS === 'android' ? 50 :-80,
  },
  super3:{
    fontSize: Platform.OS === 'android' ? 18 :25,
marginTop: Platform.OS === 'android' ? -70 :-80,
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
    width: Platform.OS === 'android' ? 345: 380,
    height: Platform.OS === 'android' ? 504:592,
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
