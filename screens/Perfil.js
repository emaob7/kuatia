import React, { useEffect,useState} from 'react';
import { View, Text, TouchableOpacity,StyleSheet, Button, Modal, ScrollView, Image,Alert } from 'react-native';
import {auth} from "../firebaseConfig";
//import {getAuth} from 'firebase/auth';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';


export default function Perfil () {

  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
 // const auth = getAuth();
 const [name, setName] = useState('');
 const [photo, setPhoto] = useState('');
 const [email, setEmail] = useState('');


 useEffect(() => {
  const fetchData = async () => {
    try {
      const storedName = await AsyncStorage.getItem('nombre');
      const storedPhoto = await AsyncStorage.getItem('foto');
      const storedEmail = await AsyncStorage.getItem('email');

      if (storedName !== null) {
        setName(storedName);
      }
      if (storedPhoto !== null) {
        setPhoto(storedPhoto);
      }
      if (storedEmail !== null) {
        setEmail(storedEmail); // Asegúrate de tener setEmail definido
      }
    } catch (error) {
      console.error('Failed to load data from AsyncStorage', error);
    }
  };

  fetchData();
}, []);



 const handleLogout = async () => {
  Alert.alert(
    'Cerrar Sesión',
    '¿Estás seguro/a que quieres cerrar la sesión?',
    [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Cerrar',
        style: 'destructive',
        onPress: async () => {
          try {
            const user = auth.currentUser;
            if (user) {
              // Identificar proveedor de inicio de sesión
              const providerId = user.providerData[0]?.providerId;

              if (providerId === 'apple.com') {
                console.log('Cerrando sesión de Apple');
                // Aquí puedes realizar acciones específicas para Apple Sign-In si es necesario
              }

              // Cerrar sesión de Firebase
              await auth.signOut();
              console.log('Sesión cerrada');

              // Limpiar archivos y AsyncStorage
              const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
              const photoFiles = files.filter(file => file.startsWith('photo'));
              await Promise.all(
                photoFiles.map(file =>
                  FileSystem.deleteAsync(`${FileSystem.documentDirectory}${file}`)
                )
              );

              await AsyncStorage.removeItem('user');
              await AsyncStorage.removeItem('nombre');
              await AsyncStorage.removeItem('foto');
              await AsyncStorage.removeItem('email');
              console.log('Datos eliminados de AsyncStorage');

              navigation.navigate('Login');
            } else {
              console.error('No hay usuario autenticado');
            }
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
            Alert.alert('Error', 'No se pudo cerrar la sesión. Intenta nuevamente.');
          }
        },
      },
    ],
    { cancelable: false }
  );
};





/*
const handleLogout = async() => {
   //const userData = await AsyncStorage.getItem('user');
   //console.log("User logged in memory!", userData);
   
    
       await auth.signOut().then(() => {
            console.log("se cerro sesion");
            
         }); 
    
         await AsyncStorage.removeItem('user');
         await AsyncStorage.removeItem('nombre');
         await AsyncStorage.removeItem('foto');
         console.log('Usuario eliminado de AsyncStorage');
         navigation.navigate("Login")
        
  }; 

*/
  
const handleDeleteAccount = () => {
  Alert.alert(
    'Eliminar Cuenta',
    '¿Estás seguro/a que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            // Obtener el usuario actual de Firebase
            const user = auth.currentUser;
            if (user) {
              // Verificar si el usuario está autenticado con Apple
              const providerData = user.providerData;
              const isAppleUser = providerData.some(
                (provider) => provider.providerId === 'apple.com'
              );
/*
              if (isAppleUser) {
                // Opcional: Informar al usuario sobre el impacto en su cuenta de Apple
                console.log('El usuario está autenticado con Apple.');
              } */

              // Eliminar la cuenta desde Firebase
              await user.delete();
              console.log('Cuenta eliminada de Firebase');

              // Limpiar AsyncStorage
              await AsyncStorage.multiRemove([
                'user',
                'nombre',
                'foto',
                'email',
              ]);
              console.log('Datos eliminados de AsyncStorage');

              // Limpiar filesystem (eliminar fotos guardadas localmente)
              const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
              const photoFiles = files.filter((file) => file.startsWith('photo'));
              await Promise.all(
                photoFiles.map((file) =>
                  FileSystem.deleteAsync(`${FileSystem.documentDirectory}${file}`)
                )
              );
           //   console.log('Archivos eliminados del sistema de archivos');

              // Navegar a la pantalla de inicio de sesión
              navigation.navigate('Login');
            } else {
              console.error('No hay un usuario autenticado');
            }
          } catch (error) {
            console.error('Error al eliminar la cuenta:', error);

            // Mostrar mensaje de error al usuario
            Alert.alert(
              'Error',
              'No se pudo eliminar la cuenta. Por favor, vuelve a iniciar sesión para intentarlo nuevamente.'
            );
          }
        },
      },
    ],
    { cancelable: false }
  );
};




  return (
    <View style={styles.container}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.image} />
      ) : (
        <View style={[styles.avatarContainer, styles.image]}>
    <FontAwesome6 name="user-large" size={50} color="#888" />
  </View>
      )}
     <Text style={styles.super}>{name || email}</Text>
      <Text style={styles.robot}>Nuestros Robots estan trabajando incanzablemente para mejorar esta pantalla con tus datos y mas opciones&#x2699;&#x1F916;</Text>
      <Text style={styles.link} onPress={() => setModalVisible(true)}>Términos de Servicio</Text>
      <Text style={styles.link} onPress={() => setModalVisible2(true)}>Declaración de privacidad</Text>
      <Text style={styles.link2} onPress={handleDeleteAccount}>Eliminar Cuenta de Kuatia</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
      <Text style={styles.textButton}>Cerrar Sesión</Text>
      </TouchableOpacity>


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <ScrollView>
            <Text style={styles.title}>Términos de Servicio de Kuatia</Text>
            <Text style={styles.termsText}>
              Bienvenido a Kuatia. Al utilizar nuestra aplicación, aceptas cumplir con los siguientes términos de servicio. Si no estás de acuerdo con estos términos, no debes utilizar la aplicación.
              {'\n\n'}1. Aceptación de los términos
              {'\n'}Al crear una cuenta y utilizar Kuatia, aceptas estos términos de servicio en su totalidad.
              {'\n\n'}2. Descripción del servicio
              {'\n'}Kuatia permite a los usuarios almacenar información de licencias de conducir, cédulas de identidad y habilitaciones vehiculares de manera local en su dispositivo. Estos documentos pueden ser mostrados a agentes de tránsito cuando sea necesario.
              {'\n\n'}3. Uso permitido
              {'\n'}Eres responsable de cualquier actividad que ocurra a través de tu cuenta. Debes proporcionar información veraz y precisa y mantener la confidencialidad de tus credenciales de inicio de sesión.
              {'\n\n'}4. Derechos y responsabilidades del usuario
              {'\n'}- No debes usar la aplicación para actividades ilegales o no autorizadas.
              {'\n'}- No debes modificar, adaptar, hackear o hacer ingeniería inversa de la aplicación.
              {'\n'}- No debes cargar contenido que sea ofensivo, abusivo, difamatorio, o que infrinja los derechos de terceros.
              {'\n\n'}5. Privacidad y manejo de datos
              {'\n'}Kuatia se compromete a proteger tu privacidad. Toda la información se almacena de manera local en tu dispositivo y no se comparte con terceros. Consulta nuestra Política de Privacidad para obtener más detalles sobre cómo manejamos tu información personal.
              {'\n\n'}6. Propiedad intelectual
              {'\n'}Todos los contenidos, marcas registradas, logotipos y gráficos proporcionados por Kuatia son propiedad de Kuatia y están protegidos por las leyes de propiedad intelectual.
              {'\n\n'}7. Limitación de responsabilidad
              {'\n'}Kuatia no será responsable de ningún daño directo, indirecto, incidental, especial, o consecuente que resulte del uso o la incapacidad de usar la aplicación. Además, Kuatia no será responsable si la información de tu cuenta es hackeada o comprometida de alguna manera. Los usuarios son responsables de tomar las medidas necesarias para proteger sus cuentas.
              {'\n\n'}8. Modificaciones de los términos
              {'\n'}Nos reservamos el derecho de modificar estos términos de servicio en cualquier momento. Notificaremos a los usuarios sobre cualquier cambio significativo. El uso continuo de la aplicación después de la notificación de cambios constituye tu aceptación de los nuevos términos.
              {'\n\n'}9. Contacto
              {'\n'}Si tienes alguna pregunta sobre estos términos, por favor contacta con nosotros a kuatiacardpy@gmail.com .
            </Text>
            </ScrollView>
            <Button
              title="Cerrar"
              onPress={() => setModalVisible(!modalVisible)}
            />
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(!modalVisible2);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <ScrollView>
            <Text style={styles.title}>Declaración de Privacidad de Kuatia</Text>
            <Text style={styles.privacyText}>
              En Kuatia, respetamos tu privacidad y nos comprometemos a proteger tu información personal. Esta declaración de privacidad explica cómo recopilamos, usamos y compartimos tu información.
              {'\n\n'}1. Información que recolectamos
              {'\n'}- Información personal: Cuando creas una cuenta en Kuatia, podemos recopilar información como tu nombre, dirección de correo electrónico y otros datos necesarios para el funcionamiento de la aplicación.
              {'\n'}- Información no personal: También recopilamos información no personal, como datos del dispositivo, información de uso y datos analíticos.
              {'\n\n'}2. Uso de la información
              {'\n'}- Utilizamos la información recopilada para mejorar y personalizar tu experiencia en Kuatia.
              {'\n'}- Para comunicarte actualizaciones, promociones y otra información relacionada con el servicio.
              {'\n'}- Para asegurar y mantener la integridad de nuestros servicios.
              {'\n\n'}3. Compartir información
              {'\n'}- No compartimos tu información personal con terceros, excepto cuando sea necesario para proporcionar los servicios de Kuatia, cumplir con la ley, o proteger nuestros derechos.
              {'\n'}- Podemos compartir información no personal con socios y proveedores de servicios para análisis y mejoras.
              {'\n\n'}4. Almacenamiento de datos
              {'\n'}- Las fotografías de los documentos almacenados en Kuatia no se almacenan en la nube. Estas imágenes se guardan exclusivamente en tu dispositivo local para garantizar tu privacidad.
              {'\n\n'}5. Seguridad de los datos
              {'\n'}Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra el acceso, alteración, divulgación o destrucción no autorizada.
              {'\n\n'}6. Derechos del usuario
              {'\n'}Tienes derecho a acceder, corregir, o eliminar tu información personal en cualquier momento. Para ejercer estos derechos, por favor contacta con nosotros a kuatiacardpy@gmail.com .
              {'\n\n'}7. Cambios en la política de privacidad
              {'\n'}Nos reservamos el derecho de modificar esta declaración de privacidad en cualquier momento. Notificaremos a los usuarios sobre cualquier cambio significativo a través de la aplicación o por correo electrónico.
              {'\n\n'}8. Contacto
              {'\n'}Si tienes alguna pregunta o preocupación sobre nuestra política de privacidad, por favor contacta con nosotros a kuatiacardpy@gmail.com .
            </Text>
            </ScrollView>
            <Button
              title="Cerrar"
              onPress={() => setModalVisible2(!modalVisible2)}
            />
          </View>
        </View>
      </Modal>

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#EAF1FB',
    paddingTop: 90,
   // paddingLeft: 20
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  text:{
    fontWeight: 'bold',
    color: "#424242"
  },

  textButton:{
    fontWeight: 'bold',
    color: "#FFFFFF"
  },
 
  
  button: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: "#1462fc",
    paddingHorizontal: 17,
    marginTop:40,
    borderRadius:10,
    height:40,
    width:150,
   // marginLeft: -20
  },

  buttonContent:{
    alignItems:"center",
    marginBottom:38,
    
  },
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'coral',
    backgroundColor: 'transparent',

    
  },
  checkboxChecked: {
    backgroundColor: 'coral',
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop:15,
    marginLeft: -20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginLeft:10,
  },
  link: {
    color: 'blue',
    marginVertical:8
   // textDecorationLine: 'underline',
  },
  link2: {
    color: 'red',
    marginVertical:8
   // textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '95%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingTop:90,
    paddingBottom:60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
  },
  robot: {
    marginBottom: 16,
  },
  super: {
    fontSize: 27,
    marginTop:-28,
    fontWeight: 'bold',
    marginLeft: -20,
    marginBottom:50
    
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom:50
  },



});

/*

import React, { useEffect, useState } from 'react';
import { View, Text, Button, AsyncStorage } from 'react-native';

const App = () => {
  const [storageSize, setStorageSize] = useState(0);

  useEffect(() => {
    calcularTamanoAsyncStorage();
  }, []);

  const calcularTamanoAsyncStorage = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;

      for (let key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += value.length;
        }
      }

      setStorageSize(totalSize);
    } catch (error) {
      console.error('Error calculando el tamaño del AsyncStorage:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Tamaño total de AsyncStorage: {storageSize} bytes</Text>
      <Button title="Recalcular" onPress={calcularTamanoAsyncStorage} />
    </View>
  );
};

export default App;


*/