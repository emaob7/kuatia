import React, { useState, useEffect } from 'react';
import {Button, StyleSheet, Modal, ScrollView, View,Text, Image,Pressable, Alert } from 'react-native';
//import { StyleSheet, View, TextInput,Text,TouchableOpacity, Image,Pressable } from 'react-native';
//import { signInWithEmailAndPassword } from "firebase/auth";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import * as AppleAuthentication from 'expo-apple-authentication';
import { getAuth, OAuthProvider } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
//import {auth} from "../firebaseConfig";
import SignInScreen from "../SignInScreen";





export default function Login() {
//  const [email, setEmail] = useState('');
//  const [password, setPassword] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [checked, setChecked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  //const [userInfo, setUserInfo] = React.useState();
 // const [loading, setLoading] = React.useState(false);
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "157595455454-gth7mn2i3kthbpojhvbe7uc184963l1a.apps.googleusercontent.com",
    androidClientId: "157595455454-pjiq01tls3a8hjgg6g00m1fnhcieubk4.apps.googleusercontent.com",
  });




  const auth = getAuth()
  const navigation = useNavigation();






  WebBrowser.maybeCompleteAuthSession();

  async function autoLogin() {
    // Obtener datos del usuario guardados en AsyncStorage
   // try {
      const uid = await AsyncStorage.getItem('user');
      if (uid !== null) { 
      // console.log("User logged in memory!", userData);
      
        navigation.replace( "Inicio")
      } else {
       // console.error('Error al obtener datos del usuario de AsyncStorage:');
       setShowLoginForm(true);

       const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const uid = user.uid;
          const nombre = user.displayName;
          const foto = user.photoURL;
         await AsyncStorage.setItem("user",(uid));
         await AsyncStorage.setItem("nombre",(nombre));
         await AsyncStorage.setItem("foto",(foto));
         
         navigation.replace( "Inicio")
        } else {
          console.log("user not authenticated");
        }
      });
      return () => unsub();

       
      }
 //   } catch (e) {
 //     console.error('Error al obtener datos del usuario de AsyncStorage:', e);
 //   }
  }
  


  const handleAppleSignIn = async () => {
    try {
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // Crear una credencial de Firebase con el token de Apple
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: appleCredential.identityToken,
      });

          
      // Iniciar sesión con Firebase
      const result = await signInWithCredential(auth, credential);
      const uid = user.uid;
          const nombre = user.displayName;
          const foto = user.photoURL;
         await AsyncStorage.setItem("user",(uid));
         await AsyncStorage.setItem("nombre",(nombre));
         await AsyncStorage.setItem("foto",(foto));

      console.log('Usuario autenticado:', result.user);
      navigation.replace( "Inicio")
    } catch (error) {
      console.error('Error durante la autenticación:', error);
    }
  };
 


 useEffect(() => {
 
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

 useEffect(() => {
    autoLogin();
    
  }, []);

/*
  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth,email, password);
      const user = auth.currentUser;
      const uid = user.uid;
      await AsyncStorage.setItem('user', uid);
      navigation.navigate("Home",{uid})
    } catch (error) {
      console.error("Failed to log in:", error);
    }
  };
*/
 
  return (
    <View style={styles.container}>
      {showLoginForm ? (
        <>
        
        <View style={styles.titlesContent}>
          <Image
           source={require('../assets/favicon1.png')} // Asegúrate de proporcionar la ruta correcta
           style={{ width: 200, height: 200, marginTop:-25, marginLeft: -20 }} // Establece el estilo de la imagen según tus necesidades
          
          />
        <Text style={styles.super}>Bienvenido a Kuatia</Text>
        <Text style={{ marginTop:5, marginLeft: -20 }}>👋 Hola! Nos alegra verte por aqui </Text>
        

        <SignInScreen 
        promptAsync={promptAsync}
        checked={checked}
         />

<AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 200, height: 44 }}
        onPress={handleAppleSignIn}
      />

      
        
        <View style={styles.checkboxContainer}>
        <Pressable
      style={[styles.checkboxBase, checked && styles.checkboxChecked]}
      onPress={() => setChecked(!checked)}>
    </Pressable>
    <Text style={styles.label}>
      Acepto los <Text style={styles.link} onPress={() => setModalVisible(true)}>Términos de Servicio</Text>
    </Text>
    
    </View>
    <Text style={styles.link} onPress={() => setModalVisible2(true)}>Declaración de privacidad</Text>
      
        </View>
       


        {/** 
<View style={{ flexDirection: "row" }}>

<View style={{ borderTopWidth: 1, borderColor: "#424242", width: "31%", marginTop:17 }} />
        <Text 
         style={{
          alignItems:"center",
          alignContent:"center",
          justifyContent:"center",
          width: "30%",
          padding: 10,
          color: "#424242"
        }}>O ingresa con</Text>
        <View style={{ borderTopWidth: 1, borderColor: "#424242", width: "31%", marginTop:17 }} />


</View>
       
        
          <Text style={styles.text}>Correo:</Text>
          <View style={styles.inputContainer}>
          <TextInput
          style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Ingrese su correo"
          />
          </View>
          
          <Text style={styles.text}>Contraseña:</Text>
          <View style={styles.inputContainer}>
          <TextInput
          style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Ingrese su contraseña"
            secureTextEntry
          />
          </View>
          

<View style={styles.buttonContent}>
       <TouchableOpacity style={styles.button} onPress={() => signIn(email, password)}>
    <Text style={styles.textButton} >INICIAR</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.buttonC} onPress={() => navigation.navigate("RegisterScreen")}>
    <Text>¿Aún no tienes una cuenta?</Text><Text style={styles.textButtonC} >Crea una cuenta</Text>
    </TouchableOpacity>
</View>
*/}
    

       

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
              {'\n'}Kuatia permite a los usuarios almacenar información de licencias de conducir, cédulas de identidad y habilitaciones vehiculares de manera local en su dispositivo. Estos documentos pueden ser mostrados a agentes de tránsito cuando sea necesario y se pueden enviar en un documento pdf.
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
              {'\n'}Kuatia no será responsable de ningún daño directo, indirecto, incidental, especial, o consecuente que resulte del uso o la incapacidad de usar la aplicación. Además, Kuatia no será responsable si la información de tu cuenta de google es hackeada o comprometida de alguna manera. Los usuarios son responsables de tomar las medidas necesarias para proteger sus cuentas de google.
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
       
        </>
      ):(null)}
    </View>
  );



 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: 100,
    paddingLeft: 20
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 22,
    borderColor:'#E0E0E0',
    borderWidth: 1,
    marginTop:4,
    height:40,
    width: "93%"
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  text:{
    fontWeight: 'bold',
    color: "#424242"
  },
  textButtonC:{
    fontWeight: 'bold',
    color: "#0D7AFF",
    fontSize: 15,

  },
  textButton:{
    fontWeight: 'bold',
    color: "#FFFFFF"
  },
   super: {
    fontSize: 27,
    marginTop:-28,
    fontWeight: 'bold',
    marginLeft: -20
    
  },
  subtitulo: {
    fontSize: 24,
      
  },
  titlesContent:{
    alignItems:"center",
    marginBottom:38,
    marginTop:5,
  },
  button: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: "#0D7AFF",
    paddingHorizontal: 17,
    marginTop:20,
    borderRadius:20,
    height:40,
    width:150,
    marginLeft: -20
  },
  buttonC: {
    justifyContent: 'space-evenly',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop:30,
    height:40,
    width:250,
    marginLeft: -20
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

});