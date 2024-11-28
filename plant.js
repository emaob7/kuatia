import React, { useState, useContext} from 'react';
import { EstadoContext } from './EstadoContext';
import { StyleSheet,View, Image, TouchableOpacity, Text, TextInput, ActivityIndicator, Button} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import firebase from "./firebase";
import "react-native-get-random-values";
import {v4 as uuidv4} from "uuid";
import { shareAsync } from 'expo-sharing';
import { EvilIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import EnviarPdf from './EnviarPdf';



 

export default function CameraScreen({ route, navigation }) {

  const [cameraRef, setCameraRef] = useState(null);
  const [picture1, setPicture1] = useState(null);
  const [picture2, setPicture2] = useState(null);
  const [fotoUrl1, setFotoUrl1] = useState(null);
  const [fotoUrl2, setFotoUrl2] = useState(null);
  const [nombre, setNombre] = useState("");
  const [cin, setCin] = useState("");
  const [progress, setProgress] = useState(null);
  const { setRefre } = useContext(EstadoContext);
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  
 //  const [photos, setPhotos] = useState([]);


  const { uid } = route.params;
 // console.log(uid)
/*
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access camera is required!');
      }
    })();
  }, []);

  */

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>Necesitamos tu permiso para usar la cámara</Text>
        <Button onPress={requestPermission} title="Conceder permiso" />
      </View>
    );
  }

  const handleBackButton = () => {
    // Lógica para volver a la pantalla anterior
    navigation.goBack()
  };






 // console.log(uid);


 //imagenes

 const shareImages = async () => {
  if (picture1 && picture2) {
    try {
console.log(picture1)
 await shareAsync(picture1);
  
    } catch (error) {
      console.error('Error sharing images:', error);
    }
  }
}; 




  //sacar foto
const takePicture = async () => {
  if (cameraRef) {
    const photo = await cameraRef.takePictureAsync({
      skipProcessing: true,
      quality: 0.10,
      width: 371,
      height: 595
    });



//comprimir 
const image = await ImageManipulator.manipulateAsync(
  photo.uri,
  // [{ crop: { originX: 185, originY: 297, width: 351, height: 550 } }],
      [{ resize: { width: 371 } }], // Redimensionar la imagen a un ancho máximo de 800 píxeles
      { compress: 0.10 } // Ajustar la calidad al 2%// Ajustar la calidad al 2%
    );


    if (!picture1) {
     
      setPicture1(image.uri);
    //  setPhotos([...photos, image.uri]);
      
    } else if (!picture2) {
      setPicture2(image.uri);
     // setPhotos([...photos, image.uri]);
      //console.log(image.uri)
    }
  }


};





const savePictures = async () => {
  
 //const db = firebase.firestore();
setProgress(true);
const nombreArchivo = uuidv4();
const extension = picture1.split('.').pop();
const file = await fetch(picture1);
const blob = await file.blob();

const file2 = await fetch(picture2);
const blob2 = await file2.blob();

const storageRef = firebase.storage.ref();
    const archivoPath = storageRef.child(`pictures/picture1-${nombreArchivo}.${extension}`);
    await archivoPath.put(blob, { contentType: `image/${extension}` });;
    const enlaceUrl = await archivoPath.getDownloadURL();
    setFotoUrl1(enlaceUrl); 
 
    const archivoPath2 = storageRef.child(`pictures/picture2-${nombreArchivo}.${extension}`);
    await archivoPath2.put(blob2, { contentType: `image/${extension}` });;
    const enlaceUrl2 = await archivoPath2.getDownloadURL();
    setFotoUrl2(enlaceUrl2); 

//console.log("POST RESPONSE: "+JSON.stringify(blob))



const agregarDatos = async () => {
 
  try {
    await firebase.db.collection(uid).add({
      nombre: nombre,
      cin: cin,
      foto1: enlaceUrl,
      foto2: enlaceUrl2,
    });
    await AsyncStorage.setItem('@datosJson', "")
    //setDocuments("");
    
    
   // console.log('Datos agregados correctamente');
  } catch (error) {
    console.error('Error al agregar datos:', error);
  }
};

agregarDatos(uid);
setRefre(true);
setProgress(false);
/*
   try {
    await ref;
   } catch (e) {
    console.log(e)
   }
*/
 
};


const cancelar = ()=>{
  setPicture1(null);
  setPicture2(null);
};


return (
  <View style={styles.container}>
    
    
    
    
  {!picture1 || !picture2 ? (
    <>
    <View style={styles.volver}> 
      <TouchableOpacity 
    onPress={handleBackButton}  >
        <Ionicons name="chevron-back-circle-outline" size={30} color="#000000" />
      </TouchableOpacity></View>
    <View style={styles.ayudaContainer}>
   
     {!picture1 ? (
        <>
        <Text style={styles.super1}>Delante</Text>
        <Text style={styles.textAyuda}>Toma la parte FRONTAL {'\u{1FAAA}'} de tu documento</Text>
        </>
        ) : (
          <>
          <Text style={styles.super1}>Detrás</Text>
          <Text style={styles.textAyuda}>Y ahora la parte de ATRÁS {'\u{1F4B3}'}</Text>
          </>
        )}
        </View>

        <CameraView style={styles.camera} facing={facing} ref={ref => setCameraRef(ref)}>
        
        <View style={styles.rectangleN} />
        {!picture1 ? (
        <View style={styles.square} />
        ) : (
        <View style={styles.square2} />
        )}
        <View style={styles.rectangle} />
      </CameraView>
     

      <View style={styles.buttonsContainer}>
      {/**   <TouchableOpacity onPress={cancelar} disabled={!picture1}>
        <Octicons name="x-circle" size={24} color="#0D7AFF"/>
        </TouchableOpacity>*/}

        <View style={styles.miniatura}>


        </View>
      <TouchableOpacity onPress={takePicture} style={styles.circleButton}>
          <View style={styles.circle} >
         
          <Ionicons name="camera-outline" size={40} color="#FFFFFF" />

          </View>
        </TouchableOpacity>
     
    </View>
   


    </>
   

 
) : (
  <>


<View style={styles.volver1}> 
      <TouchableOpacity 
    onPress={handleBackButton}  >
        <Ionicons name="chevron-back-circle-outline" size={30} color="#000000" />
      </TouchableOpacity>
      </View>

      {progress ? (

<ActivityIndicator size="small" color="#007AFF" style={styles.load} />
) : null}
  <View style={styles.lineCont}>

    <View style={styles.inputContainer}>
    
   
      <TextInput
      style={styles.inputN}
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre completo"
        placeholderTextColor="#9D9CA1"
      />
     
      <TextInput
      style={styles.inputC}
        value={cin}
        onChangeText={setCin}
        placeholder="Cedula"
        placeholderTextColor="#9D9CA1"
      />
    </View>
  </View>
  <View style={styles.vista}>

  <View style={{  alignContent:"flex-end",}}>
   <TouchableOpacity style={styles.buttonx} onPress={cancelar}>
   <Text style={{  color:"#0D7AFF"}}>Borrar</Text>
    </TouchableOpacity> 
   </View>

  </View>
 
   <View style={styles.previewContainer}>

   
   <View style={styles.previewContainer}>
   {nombre ? (
      <Text style={styles.title}>
          Fotocopia de cédula de {nombre}, con CIN {cin}
        </Text>
) : null}
        <View style={styles.imagesContainer}>
        {picture1 && <Image source={{ uri: picture1 }} style={styles.preview} />}
        {picture2 && <Image source={{ uri: picture2 }} style={styles.preview} />}
        </View>
    </View>
   
    <>
   
      
    </>
    
     
    </View>
  
 
    
  <View style={styles.buttonsContainer}>
  
  
   {fotoUrl1 && fotoUrl2 ? (
     <>
    <View style={styles.buttonOff}>
    <Text style={styles.text}>GUARDAR</Text>
    </View>
     <EnviarPdf
     nombre={nombre}
     cin={cin}
     fotoUrl1={fotoUrl1}
     fotoUrl2={fotoUrl2}
     setProgress={setProgress}
     />
      </>  
   ) : (
    <>
        <TouchableOpacity style={styles.button} onPress={savePictures}>
    <Text style={styles.text}>GUARDAR</Text>
    </TouchableOpacity>
   

    <View style={styles.buttonOff} >
     <EvilIcons name="share-apple" size={22} color="#FFFFFF" /><Text style={styles.text} >Enviar PDF</Text>
     </View>

    


    </>
   )}
  
 
  </View>
  
  
  </>
)}
  
  </View>
);






}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#f0f2f5"
  },
  camera: {
    width: 351,
    height: 550,
    marginTop:-50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  cam:{
    transform: [{ rotate: '90deg' }]
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 5,
    width: '100%',
    height: '8%',
 marginTop:8,
    
  },
  lineCont:{
    
    paddingTop: 2,
    marginBottom:5,
    width: '90%',
    height: "10%",
    

  },
  vista:{
    alignItems:"flex-end",
    marginBottom:5,
    marginTop:-20,
    width: '90%',
    
  },
  title: {
    fontSize: 10,
    marginTop:0,
    textAlign: 'center',
    padding:8
  },
  imagesContainer: {
    flexDirection: 'row',
    marginTop:-15
   // justifyContent: 'space-between',
    //alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
   // alignItems: 'center',
    paddingVertical: 28,
    width: '100%',
    height: '10%',
    marginTop:20
   //backgroundColor: "#2A2A2C",
  },
  textInput: {
    paddingVertical: 3,
    fontSize:15,
    color:"#9D9CA1"
  },
  inputN:{
    width: "100%",
    height: 28,
    fontSize: 25,
  },
  super1:{
     fontSize: 25,
   },
  inputC:{
    width: "40%",
    height: 28,
   marginTop:32,
    fontSize: 17,
  },
  previewContainer: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
   //justifyContent: 'center',
   alignItems: 'center',
    width: '90%',
    height: '60%',
    borderRadius: 3,
    padding:0,
    marginTop:8

  },
  preview: {
    width: 100,
    height: 150,
    marginHorizontal: 30,
    borderRadius: 5,
    transform: [{ rotate: '-90deg' }]
    
  },
  text: {
    // paddingVertical: 10,
     //marginLeft: 10,
     justifyContent: 'center',
     fontSize:16,
     color:"#FFFFFF"
   },
  rectangle: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 351,
    height: 550,
    borderWidth: 2,
    borderColor: "#0D7AFF",
    borderRadius: 20,
  },
  square: {
    position: 'relative',
   // alignItems: 'end',
   // justifyContent: 'end',
    width: 190,
    height: 140,
    borderWidth: 1,
    borderColor: "#0D7AFF",
    marginTop:350,
    marginLeft:22

  },
  square2: {
    position: 'relative',
   // alignItems: 'end',
   // justifyContent: 'end',
    width: 138,
    height: 450,
    borderWidth: 1,
    borderColor: "#0D7AFF",
   marginTop:-40,
    marginLeft:185

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

  textAyuda: {
     justifyContent: 'center',
     fontSize:16,
    color: "#424242"
   },
  textS: {
    paddingVertical: 5,
    //marginLeft: 10,
    justifyContent: 'center',
    fontSize:20,
    color:"#0D7AFF"
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: "#1462fc",
    paddingHorizontal: 17,
    marginTop:20,
    borderRadius:10,
    height:40
  },
  buttonOff: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: "#e0e0e0",
    paddingHorizontal: 17,
    marginTop:20,
    borderRadius:10,
    height:40
  },
  buttonS: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 1,
    paddingHorizontal: 17,
    marginTop:20,
    borderRadius:5
  },
  buttonx: {
   // flexDirection: 'row',
  alignItems: 'center',
    backgroundColor: "#e0e0e0",
    padding: 5,
    marginTop:2,
    marginRight:0,
    borderRadius:10,
    height:30
  },
  load:{
    marginBottom:25
  },
  ayudaContainer:{
    marginTop:-20,
    marginBottom:65,
    width:"90%"
  },
  volver: {
     padding: 5,
     marginTop:-15,
     marginBottom:30,
     marginLeft:"-85%",
   },
   volver1: {
    padding: 5,
    marginTop:20,
  //  marginBottom:30,
    marginLeft:"-85%",
  },

});