import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, Image, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import EnviarPdf1 from './EnviarPdf1';


export default function Habi1({ showCamera, setShowCamera }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
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
        const photo1Uri = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'photo1.jpg');
        const photo2Uri = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'photo2.jpg');
        
        if (photo1Uri.exists) {
          const photo1Base64 = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'photo1.jpg', { encoding: FileSystem.EncodingType.Base64 });
          setPhoto1(`data:image/jpg;base64,${photo1Base64}`);
          setCurrentPhoto(`data:image/jpg;base64,${photo1Base64}`);
        }

        if (photo2Uri.exists) {
          const photo2Base64 = await FileSystem.readAsStringAsync(FileSystem.documentDirectory + 'photo2.jpg', { encoding: FileSystem.EncodingType.Base64 });
          setPhoto2(`data:image/jpg;base64,${photo2Base64}`);
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
        height: 595,
        exif: true,
       });
      return photo.base64;
    }
    return null;
  };




  const handleTakePhoto = async () => {
    if (!photo1) {
      const photoBase64 = await takePicture();
      if (photoBase64) {
        const photoUri = `${FileSystem.documentDirectory}photo1.jpg`;
        await FileSystem.writeAsStringAsync(photoUri, photoBase64, { encoding: FileSystem.EncodingType.Base64 });
        setPhoto1(`data:image/jpg;base64,${photoBase64}`);
        setCurrentPhoto(`data:image/jpg;base64,${photoBase64}`);
      }
    } else if (!photo2) {
      const photoBase64 = await takePicture();
      if (photoBase64) {
        const photoUri = `${FileSystem.documentDirectory}photo2.jpg`;
        await FileSystem.writeAsStringAsync(photoUri, photoBase64, { encoding: FileSystem.EncodingType.Base64 });
        setPhoto2(`data:image/jpg;base64,${photoBase64}`);
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
    await FileSystem.deleteAsync(FileSystem.documentDirectory + 'photo1.jpg');
    setPhoto1(null);
    setCurrentPhoto(photo2 ? photo2 : null);
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
            await FileSystem.deleteAsync(FileSystem.documentDirectory + 'photo1.jpg');
            setPhoto1(null);
            setCurrentPhoto(null);
            await FileSystem.deleteAsync(FileSystem.documentDirectory + 'photo2.jpg');
            setPhoto2(null);
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
   
   {!photo1 ? (
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
          useCamera2Api={Platform.OS === 'android'}
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

             <Text style={styles.super2}>Habilitacion 1</Text>
             <Text style={styles.textAyuda2}>toca la imagen para ver el dorso 🔄 </Text>
             </>
            <>
             <TouchableOpacity onPress={() => setCurrentPhoto(currentPhoto === photo1 ? photo2 : photo1)}>
              <Image source={{ uri: currentPhoto }} style={styles.image} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10,marginBottom:-10 }}>
            <Button title="Eliminar" onPress={handleDeletePhoto} />
            
            <EnviarPdf1
     photo1={photo1}
     photo2={photo2}
     />
  
            </View>
            </>
            </>
           
          ) : (
            <>
             <View style={styles.ayudaContainer2}>
             <Text style={styles.super2}>Habilitacion 1</Text>
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
    backgroundColor:"#ebf1ff",
    width: Platform.OS === 'android' ? 345 : 395,
    height: Platform.OS === 'android' ?  504 :594,
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
marginTop: Platform.OS === 'android' ? 50 :-30,
  },
  textAyuda2: {
    justifyContent: 'center',
    fontSize:Platform.OS === 'android' ? 11 :16,
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
     width: Platform.OS === 'android' ? 345: 395,
    height: Platform.OS === 'android' ? 504:594,
    resizeMode: Platform.OS === 'ios' ? 'contain':'',
    borderWidth: 8,
    borderColor: "#e9eaee",
    borderRadius: 24,
  transform: Platform.OS === 'android' ?[{ rotate: '0deg' }]:'',
    marginVertical:Platform.OS === 'android' ? 10 : '',
  },
  volver: {
    padding: 5,
    marginTop:-15,
    marginBottom:30,
    marginLeft:"-85%",
  },
});


/**
 require File.join(File.dirname(`node --print "require.resolve('expo/package.json')"`), "scripts/autolinking")
require File.join(File.dirname(`node --print "require.resolve('react-native/package.json')"`), "scripts/react_native_pods")

require 'json'
podfile_properties = JSON.parse(File.read(File.join(__dir__, 'Podfile.properties.json'))) rescue {}

ENV['RCT_NEW_ARCH_ENABLED'] = podfile_properties['newArchEnabled'] == 'false' ? '1' : '0'
ENV['EX_DEV_CLIENT_NETWORK_INSPECTOR'] = podfile_properties['EX_DEV_CLIENT_NETWORK_INSPECTOR']

platform :ios, podfile_properties['ios.deploymentTarget'] || '15.1'
install! 'cocoapods',
  :deterministic_uuids => false

  use_modular_headers!

prepare_react_native_project!

target 'kuatia' do
  use_expo_modules!

  if ENV['EXPO_USE_COMMUNITY_AUTOLINKING'] == '1'
    config_command = ['node', '-e', "process.argv=['', '', 'config'];require('@react-native-community/cli').run()"];
  else
    config_command = [
      'node',
      '--no-warnings',
      '--eval',
      'require(require.resolve(\'expo-modules-autolinking\', { paths: [require.resolve(\'expo/package.json\')] }))(process.argv.slice(1))',
      'react-native-config',
      '--json',
      '--platform',
      'ios'
    ]
  end

  config = use_native_modules!

  pod 'GoogleUtilities', :modular_headers => true
  pod 'Firebase/Auth', :modular_headers => true
  pod 'Firebase/Core', :modular_headers => true
  pod 'Firebase/Messaging', :modular_headers => true

  #use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
  #use_frameworks! :linkage => ENV['USE_FRAMEWORKS'].to_sym if ENV['USE_FRAMEWORKS']
  use_frameworks! :linkage => :static
  $RNFirebaseAsStaticFramework = true
  use_react_native!(
    :path => config[:reactNativePath],
    :hermes_enabled => podfile_properties['expo.jsEngine'] == nil || podfile_properties['expo.jsEngine'] == 'hermes',
    # An absolute path to your application root.
    :app_path => "#{Pod::Config.instance.installation_root}/..",
    :privacy_file_aggregation_enabled => podfile_properties['apple.privacyManifestAggregationEnabled'] != 'false',
  )

  post_install do |installer|
    react_native_post_install(
      installer,
      config[:reactNativePath],
      :mac_catalyst_enabled => false,
      :ccache_enabled => podfile_properties['apple.ccacheEnabled'] == 'true',
      
    )

    # This is necessary for Xcode 14, because it signs resource bundles by default
    # when building for devices.
    installer.target_installation_results.pod_target_installation_results
      .each do |pod_name, target_installation_result|
      target_installation_result.resource_bundle_targets.each do |resource_bundle_target|
        resource_bundle_target.build_configurations.each do |config|
          config.build_settings['CODE_SIGNING_ALLOWED'] = 'NO'
        end
      end
    end
  end
end

 * 
 * 
 * 
 * 
 */